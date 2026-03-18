"""
Bids module — ORM models.
Concurrency-safe bidding with SELECT FOR UPDATE.
"""
import uuid
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, Enum as SAEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.infrastructure.database import Base
from app.shared.base_model import BaseEntityMixin
from app.shared.enums import BidStatus

if TYPE_CHECKING:
    from app.modules.auctions.models import Auction


class Bid(BaseEntityMixin, Base):
    """Bid entity — concurrency-safe, only investors can bid."""

    __tablename__ = "bids"

    auction_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("auctions.id"), nullable=False, index=True)
    bidder_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    status: Mapped[BidStatus] = mapped_column(
        SAEnum(BidStatus, name="bid_status"),
        default=BidStatus.ACTIVE,
        nullable=False,
    )

    # Relationships
    auction: Mapped["Auction"] = relationship("Auction", back_populates="bids")

    __table_args__ = (
        Index("ix_bids_auction_status", "auction_id", "status"),
        Index("ix_bids_auction_amount", "auction_id", "amount"),
    )

    def __repr__(self) -> str:
        return f"<Bid(id={self.id}, amount={self.amount}, status={self.status})>"
