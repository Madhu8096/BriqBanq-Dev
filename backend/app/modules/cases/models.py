"""
Cases module — ORM models.
Case entity for Mortgage-in-Possession (MIP) case lifecycle.
"""

from typing import Optional
from sqlalchemy import Column, ForeignKey, String, Text, Numeric, Enum as SAEnum, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.infrastructure.database import Base
from app.shared.base_model import BaseEntityMixin
from app.shared.enums import CaseStatus


class Case(BaseEntityMixin, Base):
    """
    MIP Case entity.
    Lifecycle: DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → LISTED → CLOSED
    """

    __tablename__ = "cases"

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    property_address = Column(Text, nullable=False)
    property_type = Column(String(50), nullable=False)  # e.g., RESIDENTIAL, COMMERCIAL
    estimated_value = Column(Numeric(15, 2), nullable=False)
    outstanding_debt = Column(Numeric(15, 2), nullable=False)
    status = Column(
        SAEnum(CaseStatus, name="case_status"),
        default=CaseStatus.DRAFT,
        nullable=False,
    )

    # Ownership
    borrower_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    assigned_lawyer_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    assigned_lender_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    reviewed_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )

    # Rejection
    rejection_reason = Column(Text, nullable=True)

    # Metadata
    metadata_json = Column(JSONB, nullable=True)

    # Relationships
    borrower = relationship("User", foreign_keys=[borrower_id], lazy="selectin")
    assigned_lawyer = relationship("User", foreign_keys=[assigned_lawyer_id], lazy="selectin")
    assigned_lender = relationship("User", foreign_keys=[assigned_lender_id], lazy="selectin")
    documents = relationship("Document", back_populates="case", lazy="selectin")

    __table_args__ = (
        Index("ix_cases_borrower_status", "borrower_id", "status"),
        Index("ix_cases_status", "status"),
    )

    @property
    def borrower_name(self) -> Optional[str]:
        if self.borrower:
            return f"{self.borrower.first_name} {self.borrower.last_name}"
        return None

    @property
    def lawyer_name(self) -> Optional[str]:
        if self.assigned_lawyer:
            return f"{self.assigned_lawyer.first_name} {self.assigned_lawyer.last_name}"
        return None

    @property
    def lender_name(self) -> Optional[str]:
        if self.assigned_lender:
            return f"{self.assigned_lender.first_name} {self.assigned_lender.last_name}"
        return None

    @property
    def risk_level(self) -> str:
        # Simple logic for now, could be in DB
        return "Medium"

    def __repr__(self) -> str:
        return f"<Case(id={self.id}, title={self.title}, status={self.status})>"
