"""
Cases module — ORM models.
Case entity for Mortgage-in-Possession (MIP) case lifecycle.
"""

import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional, List, Any

from sqlalchemy import ForeignKey, String, Text, Numeric, Enum as SAEnum, Index, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.infrastructure.database import Base
from app.shared.base_model import BaseEntityMixin
from app.shared.enums import CaseStatus, DealStatus

if TYPE_CHECKING:
    from app.modules.identity.models import User
    from app.modules.documents.models import Document


class Case(BaseEntityMixin, Base):
    """
    MIP Case entity.
    Lifecycle: DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → LISTED → CLOSED
    """

    __tablename__ = "cases"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    property_address: Mapped[str] = mapped_column(Text, nullable=False)
    property_type: Mapped[str] = mapped_column(String(50), nullable=False)
    estimated_value: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    outstanding_debt: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    
    interest_rate: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    tenure: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    deal_status: Mapped[Optional[DealStatus]] = mapped_column(
        SAEnum(DealStatus, name="deal_status"),
        nullable=True,
    )
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    status: Mapped[CaseStatus] = mapped_column(
        SAEnum(CaseStatus, name="case_status"),
        default=CaseStatus.DRAFT,
        nullable=False,
    )

    borrower_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    assigned_lawyer_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    assigned_lender_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    reviewed_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )

    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata_json: Mapped[Optional[Any]] = mapped_column(JSONB, nullable=True)

    # Relationships
    borrower: Mapped["User"] = relationship("User", foreign_keys=[borrower_id], lazy="selectin")
    assigned_lawyer: Mapped[Optional["User"]] = relationship("User", foreign_keys=[assigned_lawyer_id], lazy="selectin")
    assigned_lender: Mapped[Optional["User"]] = relationship("User", foreign_keys=[assigned_lender_id], lazy="selectin")
    documents: Mapped[List["Document"]] = relationship("Document", back_populates="case", lazy="selectin")

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
