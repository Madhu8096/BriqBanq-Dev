"""
Cases module — Service layer.
All business logic for case lifecycle management.
State machine enforcement, audit logging triggers, event emission.
"""

import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession  # type: ignore

from app.core.exceptions import (  # type: ignore
    InvalidStateTransitionError,
    ResourceNotFoundError,
    StaleDataError,
    AuthorizationError,
)
from app.modules.cases.models import Case  # type: ignore
from app.modules.cases.repository import CaseRepository  # type: ignore
from app.modules.notifications.service import NotificationService  # type: ignore
from app.modules.identity.repository import UserRepository  # type: ignore
from app.modules.documents.service import DocumentService  # type: ignore
from app.shared.enums import CaseStatus, DealStatus, RoleType  # type: ignore
from app.shared.mixins import StateMachineMixin  # type: ignore


class CaseStateMachine(StateMachineMixin):
    """
    Valid case lifecycle transitions.
    DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → LISTED → CLOSED
    """
    VALID_TRANSITIONS = {
        CaseStatus.DRAFT.value: [CaseStatus.SUBMITTED.value],
        CaseStatus.SUBMITTED.value: [CaseStatus.UNDER_REVIEW.value],
        CaseStatus.UNDER_REVIEW.value: [CaseStatus.APPROVED.value, CaseStatus.REJECTED.value, CaseStatus.DRAFT.value],
        CaseStatus.APPROVED.value: [CaseStatus.LISTED.value],
        CaseStatus.LISTED.value: [CaseStatus.AUCTION.value, CaseStatus.CLOSED.value],
        CaseStatus.AUCTION.value: [CaseStatus.CLOSED.value, CaseStatus.FUNDED.value],
        CaseStatus.FUNDED.value: [CaseStatus.CLOSED.value],
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
        interest_rate: Optional[Decimal] = None,
        tenure: Optional[int] = None,
    ) -> Case:
        """Create a new case in DRAFT status."""
        case = Case(
            title=title,
            description=description,
            property_address=property_address,
            property_type=property_type,
            estimated_value=estimated_value,
            outstanding_debt=outstanding_debt,
            interest_rate=interest_rate,
            tenure=tenure,
            status=CaseStatus.SUBMITTED,
            borrower_id=borrower_id,
        )
        case = await self.repository.create(case)
        return case

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
        interest_rate: Optional[Decimal] = None,
        tenure: Optional[int] = None,
        expected_version: Optional[int] = None,
        trace_id: str = "",
    ) -> Case:
        """
        Update case details. Only allowed in DRAFT status.
        Uses optimistic locking via version column.
        """
        case = await self._get_case_or_404(case_id)

        # Verify ownership
        if case.borrower_id != borrower_id:  # type: ignore[comparison-overlap]
            raise AuthorizationError(message="You can only update your own cases")

        # Only DRAFT cases can be edited
        if case.status != CaseStatus.DRAFT:  # type: ignore[comparison-overlap]
            raise InvalidStateTransitionError(
                message=f"Case cannot be edited in {case.status.value} status"
            )

        # Optimistic locking
        if expected_version is not None and case.version != expected_version:
            raise StaleDataError()

        if title is not None:
            case.title = title  # type: ignore[assignment]
        if description is not None:
            case.description = description  # type: ignore[assignment]
        if property_address is not None:
            case.property_address = property_address  # type: ignore[assignment]
        if property_type is not None:
            case.property_type = property_type  # type: ignore[assignment]
        if estimated_value is not None:
            case.estimated_value = estimated_value  # type: ignore[assignment]
        if outstanding_debt is not None:
            case.outstanding_debt = outstanding_debt  # type: ignore[assignment]
        if interest_rate is not None:
            case.interest_rate = interest_rate  # type: ignore[assignment]
        if tenure is not None:
            case.tenure = tenure  # type: ignore[assignment]

        case.version += 1
        return await self.repository.update(case)

    async def submit_case(
        self, case_id: uuid.UUID, borrower_id: uuid.UUID, trace_id: str
    ) -> Case:
        """Submit a case for review. DRAFT → SUBMITTED."""
        case = await self._get_case_or_404(case_id)

        if case.borrower_id != borrower_id:  # type: ignore[comparison-overlap]
            raise AuthorizationError(message="You can only submit your own cases")

        CaseStateMachine.validate_transition(
            case.status.value, CaseStatus.UNDER_REVIEW.value
        )

        case.status = CaseStatus.UNDER_REVIEW  # type: ignore[assignment]
        case.rejection_reason = None  # type: ignore[assignment]  # Clear any previous rejection
        case.version += 1
        case = await self.repository.update(case)

        # Notify Admin & Borrower on submission
        try:
            admin_users = await UserRepository(self.db).get_users_by_role(RoleType.ADMIN)
            notif_service = NotificationService(self.db)
            for admin in admin_users:
                await notif_service.create_notification(
                    user_id=admin.id,
                    title="New Case Submitted",
                    message=f"A new case '{case.title}' has been submitted and is ready for review.",
                    entity_type="case",
                    entity_id=str(case.id),
                    trace_id=trace_id
                )
            
            await notif_service.create_notification(
                user_id=borrower_id,
                title="Case Status: Under Review",
                message="Your case has been submitted and is now under review.",
                entity_type="case",
                entity_id=str(case.id),
                trace_id=trace_id
            )
        except Exception as e:
            print(f"Failed to send submission notifications: {e}")

        return case

    async def start_review(
        self, case_id: uuid.UUID, reviewer_id: uuid.UUID, trace_id: str
    ) -> Case:
        """Start reviewing a submitted case. SUBMITTED → UNDER_REVIEW."""
        case = await self._get_case_or_404(case_id)

        CaseStateMachine.validate_transition(
            case.status.value, CaseStatus.UNDER_REVIEW.value
        )

        case.status = CaseStatus.UNDER_REVIEW  # type: ignore[assignment]
        case.reviewed_by = reviewer_id  # type: ignore[assignment]
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

        case.status = CaseStatus.APPROVED  # type: ignore[assignment]
        case.reviewed_by = reviewer_id  # type: ignore[assignment]
        case.approved_at = datetime.utcnow()  # type: ignore[assignment]
        case.deal_status = DealStatus.LISTED  # type: ignore[assignment]  # Default to LISTED (LIVE)
        case.version += 1
        case = await self.repository.update(case)

        # Notify Borrower
        try:
            notif_service = NotificationService(self.db)
            await notif_service.create_notification(
                user_id=case.borrower_id,  # type: ignore[arg-type]
                title="Case Approved",
                message=f"Your case '{case.title}' has been approved.",
                entity_type="case",
                entity_id=str(case.id),
                trace_id=trace_id
            )
        except Exception as e:
            print(f"Failed to send borrower notification: {e}")

        return case

    async def reject_case(
        self,
        case_id: uuid.UUID,
        reviewer_id: uuid.UUID,
        reason: Optional[str],
        trace_id: str,
    ) -> Case:
        """
        Reject a case and allow resubmission.
        UNDER_REVIEW → DRAFT (with rejection_reason set).
        The borrower can then update and resubmit.
        """
        case = await self._get_case_or_404(case_id)

        # Rejection sends back to DRAFT (borrower sees rejection and can fix)
        if case.status != CaseStatus.UNDER_REVIEW:  # type: ignore[comparison-overlap]
            raise InvalidStateTransitionError(
                message=f"Case must be UNDER_REVIEW to reject, currently {case.status.value}"
            )

        case.status = CaseStatus.REJECTED  # type: ignore[assignment]
        case.reviewed_by = reviewer_id  # type: ignore[assignment]
        case.rejection_reason = reason  # type: ignore[assignment]
        case.version += 1
        case = await self.repository.update(case)

        # Notify Borrower
        try:
            notif_service = NotificationService(self.db)
            await notif_service.create_notification(
                user_id=case.borrower_id,  # type: ignore[arg-type]
                title="Case Update",
                message="Your case has been rejected.",
                entity_type="case",
                entity_id=str(case.id),
                trace_id=trace_id
            )
        except Exception as e:
            print(f"Failed to send borrower notification: {e}")

        return case

    async def list_case(
        self, case_id: uuid.UUID, admin_id: uuid.UUID, trace_id: str
    ) -> Case:
        """List an approved case for auction. APPROVED → LISTED."""
        case = await self._get_case_or_404(case_id)

        CaseStateMachine.validate_transition(
            case.status.value, CaseStatus.LISTED.value
        )

        case.status = CaseStatus.LISTED  # type: ignore[assignment]
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

        case.status = CaseStatus.CLOSED  # type: ignore[assignment]
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
            case.assigned_lawyer_id = lawyer_id  # type: ignore[assignment]
        if lender_id:
            case.assigned_lender_id = lender_id  # type: ignore[assignment]

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
        
        old_status = case.status.value
        
        # Map friendly names to enums
        status_mapping = {
            "Pending": CaseStatus.SUBMITTED,
            "Active": CaseStatus.LISTED,
            "In Auction": CaseStatus.AUCTION,
            "Completed": CaseStatus.CLOSED,
            "Rejected": CaseStatus.REJECTED,
        }
        
        if new_status in status_mapping:
            new_status_enum = status_mapping[new_status]
        else:
            new_status_enum = CaseStatus(new_status)
            
        case.status = new_status_enum
        new_status = new_status_enum.value # Use internal value for logic below
        
        # Update deal status if case moves to certain stages
        if new_status == CaseStatus.LISTED.value or new_status == CaseStatus.AUCTION.value:
            from app.modules.deals.service import DealService
            deal_service = DealService(self.db)
            existing_deal = await deal_service.repository.get_by_case_id(case_id)
            if not existing_deal:
                await deal_service.create_deal(
                    case_id=case_id,
                    title=case.title,
                    description=case.description,
                    asking_price=case.estimated_value,
                    reserve_price=None,
                    seller_id=case.borrower_id,
                    created_by=admin_id,
                    trace_id=trace_id
                )
            else:
                existing_deal.status = DealStatus.LISTED
                await deal_service.repository.update(existing_deal)
            
            # If status is AUCTION, ensure an Auction record exists
            if new_status == CaseStatus.AUCTION.value:
                from app.modules.auctions.service import AuctionService
                from app.shared.enums import AuctionStatus
                from datetime import timedelta, timezone
                
                auction_service = AuctionService(self.db)
                # Use current deal (either newly created above or existing)
                deal_id = existing_deal.id if existing_deal else (await deal_service.repository.get_by_case_id(case_id)).id
                
                existing_auctions = await auction_service.repository.get_by_deal_id(deal_id)
                if not existing_auctions:
                    now = datetime.now(timezone.utc)
                    await auction_service.create_auction(
                        deal_id=deal_id,
                        title=f"Auction for {case.title}",
                        starting_price=case.estimated_value,
                        minimum_increment=Decimal("100.00"),
                        scheduled_start=now,
                        scheduled_end=now + timedelta(days=7),
                        created_by=admin_id,
                        trace_id=trace_id
                    )
        elif new_status == CaseStatus.CLOSED.value:
            from app.modules.deals.service import DealService
            deal_service = DealService(self.db)
            existing_deal = await deal_service.repository.get_by_case_id(case_id)
            if existing_deal:
                existing_deal.status = DealStatus.CLOSED
                await deal_service.repository.update(existing_deal)
            
        case.version += 1
        case = await self.repository.update(case)

        # Notify Borrower
        if old_status != new_status:
            try:
                notif_service = NotificationService(self.db)
                
                messages = {
                    CaseStatus.SUBMITTED.value: "Your case is pending review.",
                    CaseStatus.LISTED.value: "Your case is active.",
                    CaseStatus.AUCTION.value: "Your case is in auction.",
                    CaseStatus.CLOSED.value: "Your case has been completed.",
                    CaseStatus.REJECTED.value: "Your case has been rejected.",
                }
                
                message = messages.get(new_status, f"Your case status has been updated to {new_status}.")
                
                await notif_service.create_notification(
                    user_id=case.borrower_id,  # type: ignore[arg-type]
                    title="Case Update",
                    message=message,
                    entity_type="case",
                    entity_id=str(case.id),
                    trace_id=trace_id
                )
            except Exception as e:
                print(f"Failed to send borrower notification: {e}")

        return case

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
