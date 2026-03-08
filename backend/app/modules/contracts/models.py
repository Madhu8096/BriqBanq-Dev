"""Contracts module — ORM models."""
from sqlalchemy import Column, ForeignKey, String, Text, DateTime, Enum as SAEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database import Base
from app.shared.base_model import BaseEntityMixin
from app.shared.enums import ContractStatus


class Contract(BaseEntityMixin, Base):
    """
    Contract for deal settlement.
    Lifecycle: DRAFT → PENDING_SIGNATURES → FULLY_SIGNED → EXECUTED
    """
    __tablename__ = "contracts"

    deal_id = Column(UUID(as_uuid=True), ForeignKey("deals.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    contract_type = Column(String(50), nullable=False)
    status = Column(SAEnum(ContractStatus, name="contract_status"), default=ContractStatus.DRAFT, nullable=False)
    document_s3_key = Column(String(500), nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    __table_args__ = (Index("ix_contracts_deal_status", "deal_id", "status"),)

    def __repr__(self) -> str:
        return f"<Contract(id={self.id}, deal={self.deal_id}, status={self.status})>"


class ContractSignature(BaseEntityMixin, Base):
    """Signature record for a contract."""
    __tablename__ = "contract_signatures"

    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id"), nullable=False, index=True)
    signer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    signer_role = Column(String(50), nullable=False)
    signed_at = Column(DateTime(timezone=True), nullable=True)
    signature_hash = Column(String(256), nullable=True)
    is_signed = Column(String(5), default="false", nullable=False)

    __table_args__ = (Index("ix_signatures_contract_signer", "contract_id", "signer_id"),)
