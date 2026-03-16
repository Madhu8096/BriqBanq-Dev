"""
Identity module — Pydantic schemas for request/response validation.
No DB logic here.
"""

import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.core.constants import PASSWORD_MIN_LENGTH
from app.shared.enums import UserStatus


# ─── Request Schemas ─────────────────────────────────────────────────────────

class UserRegisterRequest(BaseModel):
    """User registration request."""
    email: EmailStr
    password: str = Field(..., min_length=PASSWORD_MIN_LENGTH)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    requested_roles: List[str] = Field(
        ..., min_length=1, description="List of roles to request"
    )

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        """Lowercase email before validation."""
        if isinstance(v, str):
            return v.lower().strip()
        return v

    @field_validator("password")
    @classmethod
    def validate_password_complexity(cls, v: str) -> str:
        """Validate password complexity and length."""
        import re
        error_msg = "Password must be at least 8 characters and include one uppercase letter, one lowercase letter, one number, and one special character."
        
        # Check length
        if len(v) < 8:
            raise ValueError(error_msg)
            
        # Check complexity
        if not all([
            re.search(r"[A-Z]", v),
            re.search(r"[a-z]", v),
            re.search(r"\d", v),
            re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", v)
        ]):
            raise ValueError(error_msg)
            
        return v

    @field_validator("requested_roles")
    @classmethod
    def validate_roles(cls, v):
        from app.shared.enums import RoleType
        valid_roles = [r.value for r in RoleType]
        for role in v:
            if role not in valid_roles:
                raise ValueError(f"Invalid role: {role}. Must be one of {valid_roles}")
        return v


class UserLoginRequest(BaseModel):
    """User login request."""
    email: EmailStr
    password: str

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        """Lowercase email before validation."""
        if isinstance(v, str):
            return v.lower().strip()
        return v


class TokenRefreshRequest(BaseModel):
    """Token refresh request."""
    refresh_token: str


class UserUpdateRequest(BaseModel):
    """User profile update request."""
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)


class ChangePasswordRequest(BaseModel):
    """Change password request."""
    current_password: str
    new_password: str = Field(..., min_length=PASSWORD_MIN_LENGTH)

    @field_validator("new_password")
    @classmethod
    def validate_new_password_complexity(cls, v: str) -> str:
        """Validate new password complexity and length."""
        import re
        error_msg = "Password must be at least 8 characters and include one uppercase letter, one lowercase letter, one number, and one special character."
        
        if len(v) < 8:
            raise ValueError(error_msg)
            
        if not all([
            re.search(r"[A-Z]", v),
            re.search(r"[a-z]", v),
            re.search(r"\d", v),
            re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", v)
        ]):
            raise ValueError(error_msg)
            
        return v


# ─── Response Schemas ────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    """User response model."""
    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    status: UserStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AuthTokenResponse(BaseModel):
    """Authentication token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


from app.modules.roles.schemas import UserRoleResponse

class UserWithRolesResponse(BaseModel):
    """User response with roles included."""
    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    status: UserStatus
    user_roles: List[UserRoleResponse]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
