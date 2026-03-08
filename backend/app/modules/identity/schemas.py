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


class UserWithRolesResponse(BaseModel):
    """User response with roles included."""
    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    status: UserStatus
    roles: List[dict]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
