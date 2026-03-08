"""
Auctions module — ORM models.
Auction lifecycle: SCHEDULED → LIVE → PAUSED → LIVE → ENDED
"""

from sqlalchemy import Column, ForeignKey, String, Numeric, DateTime, Enum as SAEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.infrastructure.database import Base
from app.shared.base_model import BaseEntityMixin
from app.shared.enums import AuctionStatus


class Auction(BaseEntityMixin, Base):
    """
    Auction entity for a deal.
    Lifecycle: SCHEDULED → LIVE → PAUSED → LIVE → ENDED
    """

    __tablename__ = "auctions"

    deal_id = Column(
        UUID(as_uuid=True),
        ForeignKey("deals.id"),
        nullable=False,
        index=True,
    )
    title = Column(String(255), nullable=False)
    starting_price = Column(Numeric(15, 2), nullable=False)
    minimum_increment = Column(Numeric(15, 2), nullable=False, default=100)
    current_highest_bid = Column(Numeric(15, 2), nullable=True)
    status = Column(
        SAEnum(AuctionStatus, name="auction_status"),
        default=AuctionStatus.SCHEDULED,
        nullable=False,
    )
    scheduled_start = Column(DateTime(timezone=True), nullable=False)
    scheduled_end = Column(DateTime(timezone=True), nullable=False)
    actual_start = Column(DateTime(timezone=True), nullable=True)
    actual_end = Column(DateTime(timezone=True), nullable=True)

    winning_bid_id = Column(UUID(as_uuid=True), nullable=True)
    created_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    # Relationships
    deal = relationship("Deal", back_populates="auctions")
    bids = relationship("Bid", back_populates="auction", lazy="selectin")

    __table_args__ = (
        Index("ix_auctions_status", "status"),
        Index("ix_auctions_deal_status", "deal_id", "status"),
    )

    def __repr__(self) -> str:
        return f"<Auction(id={self.id}, status={self.status}, highest_bid={self.current_highest_bid})>"
