"""
Identity module — FastAPI routes.
Endpoints call service layer only. No direct DB calls.
No business logic in routes.
"""

import uuid

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user, get_db, get_trace_id
from app.modules.identity.policies import IdentityPolicy
from app.modules.identity.schemas import (
    AuthTokenResponse,
    ChangePasswordRequest,
    MessageResponse,
    TokenRefreshRequest,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
    UserUpdateRequest,
    UserWithRolesResponse,
)
from app.modules.identity.service import UserService
from app.shared.enums import UserStatus

router = APIRouter(prefix="/identity", tags=["Identity"])


@router.post("/register", response_model=UserResponse, status_code=201)
async def register_user(
    request: UserRegisterRequest,
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Register a new user with requested roles."""
    service = UserService(db)
    user = await service.register_user(request, trace_id)

    # Create role requests via roles service
    from app.modules.roles.service import RoleService
    role_service = RoleService(db)
    for role in request.requested_roles:
        await role_service.request_role(
            user_id=user.id,
            role_type=role,
            trace_id=trace_id,
        )

    # Log audit event
    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=str(user.id),
        actor_role="NEW_USER",
        entity_type="user",
        entity_id=str(user.id),
        action="REGISTER",
        before_state=None,
        after_state={"email": user.email, "status": user.status.value},
        trace_id=trace_id,
    )

    return user


@router.post("/login", response_model=AuthTokenResponse)
async def login(
    request: UserLoginRequest,
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Authenticate user and return JWT tokens."""
    service = UserService(db)
    tokens = await service.authenticate(request.email, request.password, trace_id)

    return tokens


@router.post("/refresh", response_model=AuthTokenResponse)
async def refresh_token(
    request: TokenRefreshRequest,
    db=Depends(get_db),
):
    """Refresh access token using refresh token."""
    service = UserService(db)
    return await service.refresh_tokens(request.refresh_token)


@router.post("/logout", response_model=MessageResponse)
async def logout(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Logout user by blacklisting token."""
    service = UserService(db)
    await service.logout(
        token=current_user.get("jti", ""),
        jti=current_user.get("jti", ""),
    )
    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
async def get_current_profile(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get current user's profile."""
    service = UserService(db)
    user = await service.get_user(uuid.UUID(current_user["user_id"]))
    return user


@router.put("/me", response_model=UserResponse)
async def update_profile(
    request: UserUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Update current user's profile."""
    service = UserService(db)
    user = await service.update_profile(
        uuid.UUID(current_user["user_id"]), request, trace_id
    )
    return user


@router.put("/me/password", response_model=MessageResponse)
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Change current user's password."""
    service = UserService(db)
    await service.change_password(
        uuid.UUID(current_user["user_id"]), request, trace_id
    )
    return MessageResponse(message="Password changed successfully")


@router.get("/users", response_model=list[UserResponse])
async def list_users(
    page: int = 1,
    page_size: int = 20,
    status: str = None,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """List all users (admin only)."""
    IdentityPolicy.can_view_all_users(current_user)
    service = UserService(db)
    user_status = UserStatus(status) if status else None
    offset = (page - 1) * page_size
    users = await service.get_all_users(offset=offset, limit=page_size, status=user_status)
    return users


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get a specific user's profile."""
    IdentityPolicy.can_view_user_profile(current_user, str(user_id))
    service = UserService(db)
    user = await service.get_user(user_id)
    return user


@router.post("/users/{user_id}/suspend", response_model=UserResponse)
async def suspend_user(
    user_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Suspend a user account (admin only)."""
    IdentityPolicy.can_suspend_user(current_user)
    service = UserService(db)
    user = await service.suspend_user(user_id, trace_id)

    # Log audit event
    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role="ADMIN",
        entity_type="user",
        entity_id=str(user_id),
        action="SUSPEND",
        before_state={"status": "ACTIVE"},
        after_state={"status": "SUSPENDED"},
        trace_id=trace_id,
    )

    return user


@router.post("/users/{user_id}/reactivate", response_model=UserResponse)
async def reactivate_user(
    user_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Reactivate a suspended user (admin only)."""
    IdentityPolicy.can_suspend_user(current_user)
    service = UserService(db)
    user = await service.reactivate_user(user_id, trace_id)

    # Log audit event
    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role="ADMIN",
        entity_type="user",
        entity_id=str(user_id),
        action="REACTIVATE",
        before_state={"status": "SUSPENDED"},
        after_state={"status": "ACTIVE"},
        trace_id=trace_id,
    )

    return user
