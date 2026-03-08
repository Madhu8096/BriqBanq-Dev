"""
Deals module — ORM models.
Deal entity for listed cases.
Lifecycle: DRAFT → LISTED → UNDER_CONTRACT → SETTLED → CLOSED
"""

from sqlalchemy import Column, ForeignKey, String, Text, Numeric, Enum as SAEnum, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.infrastructure.database import Base
from app.shared.base_model import BaseEntityMixin
from app.shared.enums import DealStatus


class Deal(BaseEntityMixin, Base):
    """
    Deal entity created from an approved/listed case.
    Lifecycle: DRAFT → LISTED → UNDER_CONTRACT → SETTLED → CLOSED
    """

    __tablename__ = "deals"

    case_id = Column(
        UUID(as_uuid=True),
        ForeignKey("cases.id"),
        nullable=False,
        unique=True,
        index=True,
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    asking_price = Column(Numeric(15, 2), nullable=False)
    reserve_price = Column(Numeric(15, 2), nullable=True)
    status = Column(
        SAEnum(DealStatus, name="deal_status"),
        default=DealStatus.DRAFT,
        nullable=False,
    )

    # Participants
    seller_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    winning_bidder_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    created_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    metadata_json = Column(JSONB, nullable=True)

    # Relationships
    auctions = relationship("Auction", back_populates="deal", lazy="selectin")

    __table_args__ = (
        Index("ix_deals_status", "status"),
        Index("ix_deals_seller", "seller_id"),
    )

    def __repr__(self) -> str:
        return f"<Deal(id={self.id}, title={self.title}, status={self.status})>"
