"""
Deals module — Pydantic schemas.
"""

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel, Field

from app.shared.enums import DealStatus


class DealCreateRequest(BaseModel):
    """Create a deal from a case."""
    case_id: uuid.UUID
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    asking_price: Decimal = Field(..., gt=0)
    reserve_price: Optional[Decimal] = Field(None, gt=0)


class DealUpdateRequest(BaseModel):
    """Update deal details (DRAFT only)."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    asking_price: Optional[Decimal] = Field(None, gt=0)
    reserve_price: Optional[Decimal] = Field(None, gt=0)


class DealResponse(BaseModel):
    """Deal response model."""
    id: uuid.UUID
    case_id: uuid.UUID
    title: str
    description: Optional[str] = None
    asking_price: Decimal
    reserve_price: Optional[Decimal] = None
    status: DealStatus
    seller_id: uuid.UUID
    winning_bidder_id: Optional[uuid.UUID] = None
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime
    version: int

    # Case related fields (joined)
    property_address: Optional[str] = None
    suburb: Optional[str] = None
    state: Optional[str] = None
    postcode: Optional[str] = None
    property_type: Optional[str] = None
    estimated_value: Optional[Decimal] = None
    interest_rate: Optional[Decimal] = None
    tenure: Optional[int] = None

    model_config = {"from_attributes": True}


class DealListResponse(BaseModel):
    """Paginated deal list."""
    items: List[DealResponse]
    total: int
    page: int
    page_size: int
