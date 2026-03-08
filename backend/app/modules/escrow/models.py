"""Escrow module — ORM models. Supports INTERNAL and EXTERNAL modes."""
from sqlalchemy import Column, ForeignKey, String, Numeric, Text, Enum as SAEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database import Base
from app.shared.base_model import BaseEntityMixin
from app.shared.enums import EscrowStatus, EscrowMode


class Escrow(BaseEntityMixin, Base):
    __tablename__ = "escrows"

    deal_id = Column(UUID(as_uuid=True), ForeignKey("deals.id"), nullable=False, index=True)
    payer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    payee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    status = Column(SAEnum(EscrowStatus, name="escrow_status"), default=EscrowStatus.PENDING, nullable=False)
    mode = Column(SAEnum(EscrowMode, name="escrow_mode"), nullable=False)
    escrow_wallet_id = Column(UUID(as_uuid=True), ForeignKey("wallets.id"), nullable=True)
    release_reason = Column(Text, nullable=True)

    __table_args__ = (
        Index("ix_escrows_deal_status", "deal_id", "status"),
    )

    def __repr__(self) -> str:
        return f"<Escrow(id={self.id}, deal={self.deal_id}, status={self.status}, mode={self.mode})>"
