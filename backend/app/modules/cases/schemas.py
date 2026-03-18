"""
Cases module — Pydantic schemas.
"""

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel, Field

from app.shared.enums import CaseStatus, DealStatus


class CaseCreateRequest(BaseModel):
    """Create a new case."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    property_address: str = Field(..., min_length=1)
    property_type: str = Field(..., min_length=1, max_length=50)
    estimated_value: Decimal = Field(..., gt=0)
    outstanding_debt: Decimal = Field(..., gt=0)
    interest_rate: Optional[Decimal] = Field(None, ge=0, le=999.99)
    tenure: Optional[int] = Field(None, gt=0)


class CaseUpdateRequest(BaseModel):
    """Update case details (only in DRAFT status)."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    property_address: Optional[str] = None
    property_type: Optional[str] = Field(None, max_length=50)
    estimated_value: Optional[Decimal] = Field(None, gt=0)
    outstanding_debt: Optional[Decimal] = Field(None, gt=0)
    interest_rate: Optional[Decimal] = Field(None, ge=0, le=999.99)
    tenure: Optional[int] = Field(None, gt=0)


class CaseReviewRequest(BaseModel):
    """Admin review action for a case."""
    rejection_reason: Optional[str] = Field(None, max_length=1000)


class CaseAssignRequest(BaseModel):
    """Assign a lawyer or lender to a case."""
    lawyer_id: Optional[uuid.UUID] = None
    lender_id: Optional[uuid.UUID] = None

class CaseStatusUpdateRequest(BaseModel):
    """Update case status."""
    status: str



class CaseResponse(BaseModel):
    """Case response model."""
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    property_address: str
    property_type: str
    estimated_value: Decimal
    outstanding_debt: Decimal
    interest_rate: Optional[Decimal] = None
    tenure: Optional[int] = None
    deal_status: Optional[DealStatus] = None
    approved_at: Optional[datetime] = None
    status: CaseStatus
    borrower_id: uuid.UUID
    borrower_name: Optional[str] = None
    assigned_lawyer_id: Optional[uuid.UUID] = None
    lawyer_name: Optional[str] = None
    assigned_lender_id: Optional[uuid.UUID] = None
    lender_name: Optional[str] = None
    risk_level: str = "Medium"
    reviewed_by: Optional[uuid.UUID] = None
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    version: int

    model_config = {"from_attributes": True}


class CaseListResponse(BaseModel):
    """Paginated case list response."""
    items: List[CaseResponse]
    total: int
    page: int
    page_size: int
