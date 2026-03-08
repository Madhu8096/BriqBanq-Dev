"""
Auctions module — Pydantic schemas.
"""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field
from app.shared.enums import AuctionStatus


class AuctionCreateRequest(BaseModel):
    deal_id: uuid.UUID
    title: str = Field(..., min_length=1, max_length=255)
    starting_price: Decimal = Field(..., gt=0)
    minimum_increment: Decimal = Field(default=Decimal("100"), gt=0)
    scheduled_start: datetime
    scheduled_end: datetime


class AuctionResponse(BaseModel):
    id: uuid.UUID
    deal_id: uuid.UUID
    title: str
    starting_price: Decimal
    minimum_increment: Decimal
    current_highest_bid: Optional[Decimal] = None
    status: AuctionStatus
    scheduled_start: datetime
    scheduled_end: datetime
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    winning_bid_id: Optional[uuid.UUID] = None
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime
    version: int
    model_config = {"from_attributes": True}


class AuctionWinnerResponse(BaseModel):
    winning_bid_id: uuid.UUID
    winning_investor_id: uuid.UUID
    amount: Decimal
    model_config = {"from_attributes": True}

class AuctionListResponse(BaseModel):
    items: List[AuctionResponse]
    total: int
    page: int
    page_size: int
