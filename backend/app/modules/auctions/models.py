"""
Auctions module — ORM models.
Auction lifecycle: SCHEDULED → LIVE → PAUSED → LIVE → ENDED
"""

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional
import uuid

from sqlalchemy import ForeignKey, String, Numeric, DateTime, Enum as SAEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.infrastructure.database import Base
from app.shared.base_model import BaseEntityMixin
from app.shared.enums import AuctionStatus

if TYPE_CHECKING:
    from app.modules.deals.models import Deal
    from app.modules.bids.models import Bid


class Auction(BaseEntityMixin, Base):
    """
    Auction entity for a deal.
    Lifecycle: SCHEDULED → LIVE → PAUSED → LIVE → ENDED
    """

    __tablename__ = "auctions"

    deal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("deals.id"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    starting_price: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    minimum_increment: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False, default=100)
    current_highest_bid: Mapped[Optional[Decimal]] = mapped_column(Numeric(15, 2), nullable=True)
    status: Mapped[AuctionStatus] = mapped_column(
        SAEnum(AuctionStatus, name="auction_status"),
        default=AuctionStatus.SCHEDULED,
        nullable=False,
    )
    scheduled_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    scheduled_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    actual_start: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    actual_end: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    winning_bid_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    # Relationships
    deal: Mapped["Deal"] = relationship("Deal", back_populates="auctions")
    bids: Mapped[List["Bid"]] = relationship("Bid", back_populates="auction", lazy="selectin")

    __table_args__ = (
        Index("ix_auctions_status", "status"),
        Index("ix_auctions_deal_status", "deal_id", "status"),
    )

    def __repr__(self) -> str:
        return f"<Auction(id={self.id}, status={self.status}, highest_bid={self.current_highest_bid})>"
