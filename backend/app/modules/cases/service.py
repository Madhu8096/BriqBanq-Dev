"""
Cases module — Service layer.
All business logic for case lifecycle management.
State machine enforcement, audit logging triggers, event emission.
"""

import uuid
from decimal import Decimal
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    InvalidStateTransitionError,
    ResourceNotFoundError,
    StaleDataError,
    AuthorizationError,
)
from app.modules.cases.models import Case
from app.modules.cases.repository import CaseRepository
from app.shared.enums import CaseStatus
from app.shared.mixins import StateMachineMixin


class CaseStateMachine(StateMachineMixin):
    """
    Valid case lifecycle transitions.
    DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → LISTED → CLOSED
    """
    VALID_TRANSITIONS = {
        CaseStatus.DRAFT.value: [CaseStatus.SUBMITTED.value],
        CaseStatus.SUBMITTED.value: [CaseStatus.UNDER_REVIEW.value],
        CaseStatus.UNDER_REVIEW.value: [CaseStatus.APPROVED.value, CaseStatus.SUBMITTED.value],  # SUBMITTED = rejection resubmit
        CaseStatus.APPROVED.value: [CaseStatus.LISTED.value],
        CaseStatus.LISTED.value: [CaseStatus.CLOSED.value],
    }


class CaseService:
    """Service layer for case management business logic."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = CaseRepository(db)

    async def create_case(
        self,
        borrower_id: uuid.UUID,
        title: str,
        description: Optional[str],
        property_address: str,
        property_type: str,
        estimated_value: Decimal,
        outstanding_debt: Decimal,
        trace_id: str,
    ) -> Case:
        """Create a new case in DRAFT status."""
        case = Case(
            title=title,
            description=description,
            property_address=property_address,
            property_type=property_type,
            estimated_value=estimated_value,
            outstanding_debt=outstanding_debt,
            status=CaseStatus.DRAFT,
            borrower_id=borrower_id,
        )
        return await self.repository.create(case)

    async def update_case(
        self,
        case_id: uuid.UUID,
        borrower_id: uuid.UUID,
        title: Optional[str] = None,
        description: Optional[str] = None,
        property_address: Optional[str] = None,
        property_type: Optional[str] = None,
        estimated_value: Optional[Decimal] = None,
        outstanding_debt: Optional[Decimal] = None,
        expected_version: Optional[int] = None,
        trace_id: str = "",
    ) -> Case:
        """
        Update case details. Only allowed in DRAFT status.
        Uses optimistic locking via version column.
        """
        case = await self._get_case_or_404(case_id)

        # Verify ownership
        if case.borrower_id != borrower_id:
            raise AuthorizationError(message="You can only update your own cases")

        # Only DRAFT cases can be edited
        if case.status != CaseStatus.DRAFT:
            raise InvalidStateTransitionError(
                message=f"Case cannot be edited in {case.status.value} status"
            )

        # Optimistic locking
        if expected_version is not None and case.version != expected_version:
            raise StaleDataError()

        if title is not None:
            case.title = title
        if description is not None:
            case.description = description
        if property_address is not None:
            case.property_address = property_address
        if property_type is not None:
            case.property_type = property_type
        if estimated_value is not None:
            case.estimated_value = estimated_value
        if outstanding_debt is not None:
            case.outstanding_debt = outstanding_debt

        case.version += 1
        return await self.repository.update(case)

    async def submit_case(
        self, case_id: uuid.UUID, borrower_id: uuid.UUID, trace_id: str
    ) -> Case:
        """Submit a case for review. DRAFT → SUBMITTED."""
        case = await self._get_case_or_404(case_id)

        if case.borrower_id != borrower_id:
            raise AuthorizationError(message="You can only submit your own cases")

        CaseStateMachine.validate_transition(
            case.status.value, CaseStatus.SUBMITTED.value
        )

        case.status = CaseStatus.SUBMITTED
        case.rejection_reason = None  # Clear any previous rejection
        case.version += 1
        return await self.repository.update(case)

    async def start_review(
        self, case_id: uuid.UUID, reviewer_id: uuid.UUID, trace_id: str
    ) -> Case:
        """Start reviewing a submitted case. SUBMITTED → UNDER_REVIEW."""
        case = await self._get_case_or_404(case_id)

        CaseStateMachine.validate_transition(
            case.status.value, CaseStatus.UNDER_REVIEW.value
        )

        case.status = CaseStatus.UNDER_REVIEW
        case.reviewed_by = reviewer_id
        case.version += 1
        return await self.repository.update(case)

    async def approve_case(
        self, case_id: uuid.UUID, reviewer_id: uuid.UUID, trace_id: str
    ) -> Case:
        """Approve a case under review. UNDER_REVIEW → APPROVED."""
        case = await self._get_case_or_404(case_id)

        CaseStateMachine.validate_transition(
            case.status.value, CaseStatus.APPROVED.value
        )

        case.status = CaseStatus.APPROVED
        case.reviewed_by = reviewer_id
        case.version += 1
        return await self.repository.update(case)

    async def reject_case(
        self,
        case_id: uuid.UUID,
        reviewer_id: uuid.UUID,
        reason: Optional[str],
        trace_id: str,
    ) -> Case:
        """
        Reject a case and allow resubmission.
        UNDER_REVIEW → SUBMITTED (with rejection_reason set).
        The borrower can then update and resubmit.
        """
        case = await self._get_case_or_404(case_id)

        # Rejection sends back to SUBMITTED (borrower sees rejection and can fix)
        if case.status != CaseStatus.UNDER_REVIEW:
            raise InvalidStateTransitionError(
                message=f"Case must be UNDER_REVIEW to reject, currently {case.status.value}"
            )

        case.status = CaseStatus.DRAFT  # Back to draft for editing
        case.reviewed_by = reviewer_id
        case.rejection_reason = reason
        case.version += 1
        return await self.repository.update(case)

    async def list_case(
        self, case_id: uuid.UUID, admin_id: uuid.UUID, trace_id: str
    ) -> Case:
        """List an approved case for auction. APPROVED → LISTED."""
        case = await self._get_case_or_404(case_id)

        CaseStateMachine.validate_transition(
            case.status.value, CaseStatus.LISTED.value
        )

        case.status = CaseStatus.LISTED
        case.version += 1
        return await self.repository.update(case)

    async def close_case(
        self, case_id: uuid.UUID, admin_id: uuid.UUID, trace_id: str
    ) -> Case:
        """Close a listed case. LISTED → CLOSED."""
        case = await self._get_case_or_404(case_id)

        CaseStateMachine.validate_transition(
            case.status.value, CaseStatus.CLOSED.value
        )

        case.status = CaseStatus.CLOSED
        case.version += 1
        return await self.repository.update(case)

    async def assign_participants(
        self,
        case_id: uuid.UUID,
        lawyer_id: Optional[uuid.UUID] = None,
        lender_id: Optional[uuid.UUID] = None,
        trace_id: str = "",
    ) -> Case:
        """Assign a lawyer and/or lender to a case."""
        case = await self._get_case_or_404(case_id)

        if lawyer_id:
            case.assigned_lawyer_id = lawyer_id
        if lender_id:
            case.assigned_lender_id = lender_id

        case.version += 1
        return await self.repository.update(case)

    async def get_case(self, case_id: uuid.UUID) -> Case:
        """Get a case by ID."""
        return await self._get_case_or_404(case_id)

    async def update_case_status(
        self, case_id: uuid.UUID, new_status: str, admin_id: uuid.UUID, trace_id: str
    ) -> Case:
        """Update case status (override or progress)."""
        case = await self._get_case_or_404(case_id)
        
        if new_status == "VERIFIED":
            from app.modules.documents.service import DocumentService
            documents = await DocumentService(self.db).get_case_documents(case_id)
            if documents and not all(doc.status == "APPROVED" for doc in documents):
                raise Exception("All documents must be verified first")
                
        case.status = CaseStatus(new_status)
        case.version += 1
        return await self.repository.update(case)

    async def delete_case(self, case_id: uuid.UUID, admin_id: uuid.UUID, trace_id: str) -> None:
        """Delete a case (admin only)."""
        case = await self._get_case_or_404(case_id)
        # Any specific deletion logic (e.g. check status, related records) goes here
        await self.repository.delete(case)

    async def get_borrower_cases(
        self,
        borrower_id: uuid.UUID,
        status: Optional[CaseStatus] = None,
        offset: int = 0,
        limit: int = 20,
    ) -> List[Case]:
        """Get all cases for a borrower."""
        return await self.repository.get_by_borrower(
            borrower_id, status, offset, limit
        )

    async def get_all_cases(
        self,
        status: Optional[CaseStatus] = None,
        offset: int = 0,
        limit: int = 20,
    ) -> tuple[List[Case], int]:
        """Get all cases with count."""
        cases = await self.repository.get_all(status, offset, limit)
        total = await self.repository.count(status)
        return cases, total

    async def get_cases_for_review(
        self, offset: int = 0, limit: int = 20
    ) -> List[Case]:
        """Get submitted cases awaiting review."""
        return await self.repository.get_for_review(offset, limit)

    async def _get_case_or_404(self, case_id: uuid.UUID) -> Case:
        """Get case or raise not found."""
        case = await self.repository.get_by_id(case_id)
        if not case:
            raise ResourceNotFoundError(message="Case not found")
        return case
