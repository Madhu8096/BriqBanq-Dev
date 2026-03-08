"""
Bids module — ORM models.
Concurrency-safe bidding with SELECT FOR UPDATE.
"""
from sqlalchemy import Column, ForeignKey, Numeric, Enum as SAEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base
from app.shared.base_model import BaseEntityMixin
from app.shared.enums import BidStatus


class Bid(BaseEntityMixin, Base):
    """Bid entity — concurrency-safe, only investors can bid."""

    __tablename__ = "bids"

    auction_id = Column(UUID(as_uuid=True), ForeignKey("auctions.id"), nullable=False, index=True)
    bidder_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Numeric(15, 2), nullable=False)
    status = Column(
        SAEnum(BidStatus, name="bid_status"),
        default=BidStatus.ACTIVE,
        nullable=False,
    )

    # Relationships
    auction = relationship("Auction", back_populates="bids")

    __table_args__ = (
        Index("ix_bids_auction_status", "auction_id", "status"),
        Index("ix_bids_auction_amount", "auction_id", "amount"),
    )

    def __repr__(self) -> str:
        return f"<Bid(id={self.id}, amount={self.amount}, status={self.status})>"
