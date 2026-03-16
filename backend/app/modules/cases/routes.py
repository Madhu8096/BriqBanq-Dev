"""
Cases module — FastAPI routes.
Calls service layer only. No direct DB calls. No business logic.
"""

import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_current_user, get_db, get_trace_id
from app.modules.cases.policies import CasePolicy
from app.modules.cases.schemas import (
    CaseAssignRequest,
    CaseCreateRequest,
    CaseListResponse,
    CaseResponse,
    CaseReviewRequest,
    CaseUpdateRequest,
    CaseStatusUpdateRequest,
)
from app.modules.cases.service import CaseService
from app.modules.identity.schemas import MessageResponse
from app.shared.enums import CaseStatus

router = APIRouter(prefix="/cases", tags=["Cases"])


@router.post("/", response_model=CaseResponse, status_code=201)
async def create_case(
    request: CaseCreateRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Create a new MIP case (borrower only)."""
    CasePolicy.can_create_case(current_user)
    service = CaseService(db)
    case = await service.create_case(
        borrower_id=uuid.UUID(current_user["user_id"]),
        title=request.title,
        description=request.description,
        property_address=request.property_address,
        property_type=request.property_type,
        estimated_value=request.estimated_value,
        outstanding_debt=request.outstanding_debt,
        trace_id=trace_id,
    )

    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role="BORROWER",
        entity_type="case",
        entity_id=str(case.id),
        action="CREATE_CASE",
        before_state=None,
        after_state={"status": "DRAFT", "title": case.title},
        trace_id=trace_id,
    )

    return case


@router.put("/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: uuid.UUID,
    request: CaseUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Update a case (only in DRAFT status, borrower only)."""
    service = CaseService(db)
    case = await service.update_case(
        case_id=case_id,
        borrower_id=uuid.UUID(current_user["user_id"]),
        title=request.title,
        description=request.description,
        property_address=request.property_address,
        property_type=request.property_type,
        estimated_value=request.estimated_value,
        outstanding_debt=request.outstanding_debt,
        trace_id=trace_id,
    )

    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role="BORROWER",
        entity_type="case",
        entity_id=str(case_id),
        action="UPDATE_CASE",
        before_state=None,
        after_state={"status": case.status.value},
        trace_id=trace_id,
    )

    return case


@router.put("/{case_id}/status", response_model=CaseResponse)
async def update_case_status_endpoint(
    case_id: uuid.UUID,
    request: CaseStatusUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Update case status directly."""
    CasePolicy.can_review_case(current_user)
    service = CaseService(db)
    case = await service.update_case_status(
        case_id=case_id,
        new_status=request.status,
        admin_id=uuid.UUID(current_user["user_id"]),
        trace_id=trace_id,
    )
    
    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role="ADMIN",
        entity_type="case",
        entity_id=str(case_id),
        action="UPDATE_STATUS",
        before_state=None,
        after_state={"status": request.status},
        trace_id=trace_id,
    )
    
    return case


@router.post("/{case_id}/submit", response_model=CaseResponse)
async def submit_case(
    case_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Submit a case for review (borrower only)."""
    service = CaseService(db)
    case = await service.submit_case(
        case_id=case_id,
        borrower_id=uuid.UUID(current_user["user_id"]),
        trace_id=trace_id,
    )

    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role="BORROWER",
        entity_type="case",
        entity_id=str(case_id),
        action="SUBMIT_CASE",
        before_state={"status": "DRAFT"},
        after_state={"status": "SUBMITTED"},
        trace_id=trace_id,
    )

    return case


@router.post("/{case_id}/review", response_model=CaseResponse)
async def start_case_review(
    case_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Start reviewing a submitted case (admin/lawyer only)."""
    CasePolicy.can_review_case(current_user)
    service = CaseService(db)
    case = await service.start_review(
        case_id=case_id,
        reviewer_id=uuid.UUID(current_user["user_id"]),
        trace_id=trace_id,
    )

    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role=",".join(current_user.get("roles", [])),
        entity_type="case",
        entity_id=str(case_id),
        action="START_REVIEW",
        before_state={"status": "SUBMITTED"},
        after_state={"status": "UNDER_REVIEW"},
        trace_id=trace_id,
    )

    return case


@router.post("/{case_id}/approve", response_model=CaseResponse)
async def approve_case(
    case_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Approve a case under review (admin/lawyer only)."""
    CasePolicy.can_review_case(current_user)
    service = CaseService(db)
    case = await service.approve_case(
        case_id=case_id,
        reviewer_id=uuid.UUID(current_user["user_id"]),
        trace_id=trace_id,
    )

    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role=",".join(current_user.get("roles", [])),
        entity_type="case",
        entity_id=str(case_id),
        action="APPROVE_CASE",
        before_state={"status": "UNDER_REVIEW"},
        after_state={"status": "APPROVED"},
        trace_id=trace_id,
    )

    return case


@router.post("/{case_id}/reject", response_model=CaseResponse)
async def reject_case(
    case_id: uuid.UUID,
    request: CaseReviewRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Reject a case and return to draft for corrections (admin/lawyer only)."""
    CasePolicy.can_review_case(current_user)
    service = CaseService(db)
    case = await service.reject_case(
        case_id=case_id,
        reviewer_id=uuid.UUID(current_user["user_id"]),
        reason=request.rejection_reason,
        trace_id=trace_id,
    )

    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role=",".join(current_user.get("roles", [])),
        entity_type="case",
        entity_id=str(case_id),
        action="REJECT_CASE",
        before_state={"status": "UNDER_REVIEW"},
        after_state={"status": "DRAFT", "reason": request.rejection_reason},
        trace_id=trace_id,
    )

    return case


@router.post("/{case_id}/list", response_model=CaseResponse)
async def list_case_for_auction(
    case_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """List an approved case for auction (admin only)."""
    CasePolicy.can_list_all_cases(current_user)
    service = CaseService(db)
    case = await service.list_case(
        case_id=case_id,
        admin_id=uuid.UUID(current_user["user_id"]),
        trace_id=trace_id,
    )

    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role="ADMIN",
        entity_type="case",
        entity_id=str(case_id),
        action="LIST_CASE",
        before_state={"status": "APPROVED"},
        after_state={"status": "LISTED"},
        trace_id=trace_id,
    )

    return case


@router.post("/{case_id}/assign", response_model=CaseResponse)
async def assign_participants(
    case_id: uuid.UUID,
    request: CaseAssignRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Assign a lawyer and/or lender to a case (admin only)."""
    CasePolicy.can_assign_participants(current_user)
    service = CaseService(db)
    case = await service.assign_participants(
        case_id=case_id,
        lawyer_id=request.lawyer_id,
        lender_id=request.lender_id,
        trace_id=trace_id,
    )

    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role="ADMIN",
        entity_type="case",
        entity_id=str(case_id),
        action="ASSIGN_PARTICIPANTS",
        before_state=None,
        after_state={
            "lawyer_id": str(request.lawyer_id) if request.lawyer_id else None,
            "lender_id": str(request.lender_id) if request.lender_id else None,
        },
        trace_id=trace_id,
    )

    return case


@router.get("/my-cases", response_model=list[CaseResponse])
async def get_my_cases(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get current user's cases (borrower)."""
    service = CaseService(db)
    case_status = CaseStatus(status) if status else None
    offset = (page - 1) * page_size
    return await service.get_borrower_cases(
        borrower_id=uuid.UUID(current_user["user_id"]),
        status=case_status,
        offset=offset,
        limit=page_size,
    )


@router.get("/review-queue", response_model=list[CaseResponse])
async def get_review_queue(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get cases submitted for review (admin/lawyer only)."""
    CasePolicy.can_review_case(current_user)
    service = CaseService(db)
    offset = (page - 1) * page_size
    return await service.get_cases_for_review(offset=offset, limit=page_size)


@router.get("/", response_model=CaseListResponse)
async def list_all_cases(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """List all cases (admin only)."""
    CasePolicy.can_list_all_cases(current_user)
    service = CaseService(db)
    case_status = CaseStatus(status) if status else None
    offset = (page - 1) * page_size
    cases, total = await service.get_all_cases(
        status=case_status, offset=offset, limit=page_size
    )
    return CaseListResponse(items=cases, total=total, page=page, page_size=page_size)


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(
    case_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get a specific case."""
    service = CaseService(db)
    case = await service.get_case(case_id)
    CasePolicy.can_view_case(current_user, str(case.borrower_id))
    return case


@router.get("/{case_id}/export")
async def export_case_report(
    case_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Export a case report as JSON."""
    service = CaseService(db)
    case = await service.get_case(case_id)
    CasePolicy.can_view_case(current_user, str(case.borrower_id))

    # Construct complete report data
    report_data = {
        "case_id": str(case.id),
        "title": case.title,
        "status": case.status.value,
        "borrower_name": case.borrower_name,
        "property_address": case.property_address,
        "property_type": case.property_type,
        "estimated_value": float(case.estimated_value),
        "outstanding_debt": float(case.outstanding_debt),
        "lender_name": case.lender_name,
        "lawyer_name": case.lawyer_name,
        "risk_level": case.risk_level,
        "created_at": case.created_at.isoformat(),
        "exported_at": uuid.uuid4().hex, # Placeholder for unique export ID if needed
    }
    
    return report_data

@router.delete("/{case_id}", response_model=MessageResponse)
async def delete_case_endpoint(
    case_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Delete a case (admin only)."""
    CasePolicy.can_list_all_cases(current_user) # Using "list_all_cases" policy which is admin-only
    service = CaseService(db)
    await service.delete_case(
        case_id=case_id,
        admin_id=uuid.UUID(current_user["user_id"]),
        trace_id=trace_id,
    )
    
    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role="ADMIN",
        entity_type="case",
        entity_id=str(case_id),
        action="DELETE_CASE",
        before_state=None,
        after_state=None,
        trace_id=trace_id,
    )
    
    return MessageResponse(message="Case deleted successfully")
