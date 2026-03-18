"""
Identity module — Service layer.
Contains ALL business logic for user management.
- Registration with role requests
- Authentication (login/logout)
- Token management
- Profile updates
- Audit logging triggers
"""

import uuid
from typing import Optional, List

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import AUDIT_ACTION_CREATE, AUDIT_ACTION_LOGIN, AUDIT_ACTION_LOGOUT, AUDIT_ACTION_UPDATE
from app.core.exceptions import (
    AccountSuspendedError,
    DuplicateEmailError,
    InvalidCredentialsError,
    ResourceNotFoundError,
    TokenBlacklistedError,
)
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.core.config import settings
from app.infrastructure.redis import redis_client
from app.modules.identity.models import User
from app.modules.identity.repository import UserRepository
from app.modules.identity.schemas import (
    AuthTokenResponse,
    ChangePasswordRequest,
    UserRegisterRequest,
    UserUpdateRequest,
)
from app.shared.enums import RoleType, UserStatus


class UserService:
    """Service layer for user management business logic."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = UserRepository(db)

    async def register_user(
        self,
        request: UserRegisterRequest,
        trace_id: str,
    ) -> User:
        """
        Register a new user.
        - Validates unique email
        - Hashes password
        - Creates user record
        - Creates role requests (handled by roles module)
        - Logs audit event
        """
        # Check for duplicate email
        existing_user = await self.repository.get_by_email(request.email)
        if existing_user:
            raise DuplicateEmailError()

        # Hash password (validates strength internally)
        hashed_password = hash_password(request.password)

        # Create user entity
        user = User(
            email=request.email,
            hashed_password=hashed_password,
            first_name=request.first_name,
            last_name=request.last_name,
            phone=request.phone,
            status=UserStatus.ACTIVE,
        )

        user = await self.repository.create(user)

        # Create role requests (deferred to roles service in routes)
        # Audit logging (deferred to audit service in routes)

        return user

    async def authenticate(
        self, email: str, password: str, trace_id: str
    ) -> AuthTokenResponse:
        """
        Authenticate user and return tokens.
        - Validates credentials
        - Checks account status
        - Generates JWT tokens
        """
        user = await self.repository.get_by_email(email)
        if not user:
            raise InvalidCredentialsError()

        if user.status.value == UserStatus.SUSPENDED.value:  # type: ignore[attr-defined]
            raise AccountSuspendedError()

        if not verify_password(password, user.hashed_password):  # type: ignore[arg-type]
            raise InvalidCredentialsError()

        # Get approved roles
        approved_roles = []
        if user.user_roles:
            from app.shared.enums import RoleStatus
            approved_roles = [
                ur.role_type.value
                for ur in user.user_roles
                if ur.status == RoleStatus.APPROVED
            ]

        # Generate tokens
        access_token = create_access_token(
            user_id=str(user.id),
            roles=approved_roles,
        )
        refresh_token = create_refresh_token(user_id=str(user.id))

        return AuthTokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.jwt_access_token_expire_minutes * 60,
        )

    async def refresh_tokens(self, refresh_token: str) -> AuthTokenResponse:
        """
        Refresh access token using a valid refresh token.
        - Validates refresh token
        - Checks blacklist
        - Issues new token pair
        - Blacklists old refresh token
        """
        # Check blacklist
        is_blacklisted = await redis_client.get(f"token_blacklist:{refresh_token}")
        if is_blacklisted:
            raise TokenBlacklistedError()

        payload = decode_token(refresh_token)

        if payload.get("type") != "refresh":
            raise InvalidCredentialsError(message="Invalid token type")

        user_id = payload["sub"]
        user = await self.repository.get_by_id(uuid.UUID(user_id))
        if not user:
            raise ResourceNotFoundError(message="User not found")

        if user.status.value == UserStatus.SUSPENDED.value:  # type: ignore[attr-defined]
            raise AccountSuspendedError()

        # Get approved roles
        approved_roles = []
        if user.user_roles:
            from app.shared.enums import RoleStatus
            approved_roles = [
                ur.role_type.value
                for ur in user.user_roles
                if ur.status == RoleStatus.APPROVED
            ]

        # Blacklist old refresh token
        await redis_client.set(
            f"token_blacklist:{refresh_token}",
            "1",
            expire=settings.jwt_refresh_token_expire_days * 86400,
        )

        # Generate new tokens
        new_access_token = create_access_token(
            user_id=user_id,
            roles=approved_roles,
        )
        new_refresh_token = create_refresh_token(user_id=user_id)

        return AuthTokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            expires_in=settings.jwt_access_token_expire_minutes * 60,
        )

    async def logout(self, token: str, jti: str) -> None:
        """
        Logout user by blacklisting their token.
        """
        await redis_client.set(
            f"token_blacklist:{token}",
            "1",
            expire=settings.jwt_access_token_expire_minutes * 60,
        )

    async def get_user(self, user_id: uuid.UUID) -> User:
        """Get user by ID."""
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundError(message="User not found")
        return user

    async def get_user_by_email(self, email: str) -> User:
        """Get user by email."""
        user = await self.repository.get_by_email(email)
        if not user:
            raise ResourceNotFoundError(message="User not found")
        return user

    async def update_profile(
        self,
        user_id: uuid.UUID,
        request: UserUpdateRequest,
        trace_id: str,
    ) -> User:
        """Update user profile."""
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundError(message="User not found")

        if request.first_name:
            user.first_name = request.first_name  # type: ignore[assignment]
        if request.last_name:
            user.last_name = request.last_name  # type: ignore[assignment]
        if request.phone is not None:
            user.phone = request.phone  # type: ignore[assignment]

        return await self.repository.update(user)

    async def change_password(
        self,
        user_id: uuid.UUID,
        request: ChangePasswordRequest,
        trace_id: str,
    ) -> None:
        """Change user password."""
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundError(message="User not found")

        if not verify_password(request.current_password, user.hashed_password):  # type: ignore[arg-type]
            raise InvalidCredentialsError(message="Current password is incorrect")

        user.hashed_password = hash_password(request.new_password)  # type: ignore[assignment]
        await self.repository.update(user)

    async def suspend_user(self, user_id: uuid.UUID, trace_id: str) -> User:
        """Suspend a user account."""
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundError(message="User not found")

        user.status = UserStatus.SUSPENDED  # type: ignore[assignment]
        await self.repository.update(user)

        # Cache suspension status for fast auth checks
        await redis_client.set(f"user_suspended:{user_id}", "1")

        return user

    async def reactivate_user(self, user_id: uuid.UUID, trace_id: str) -> User:
        """Reactivate a suspended user account."""
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundError(message="User not found")

        user.status = UserStatus.ACTIVE  # type: ignore[assignment]
        await self.repository.update(user)

        # Remove suspension cache
        await redis_client.delete(f"user_suspended:{user_id}")

        return user

    async def get_all_users(
        self, offset: int = 0, limit: int = 20, status: Optional[UserStatus] = None
    ) -> List[User]:
        """Get all users with pagination."""
        return await self.repository.get_all(offset=offset, limit=limit, status=status)
