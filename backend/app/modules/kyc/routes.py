"""
KYC module — FastAPI routes.
"""

import uuid

from fastapi import APIRouter, Depends, UploadFile, File, Form

from app.core.dependencies import get_current_user, get_db, get_trace_id
from app.modules.kyc.policies import KYCPolicy
from app.modules.kyc.schemas import KYCReviewRequest, KYCResponse, KYCSubmitRequest
from app.modules.kyc.service import KYCService

router = APIRouter(prefix="/kyc", tags=["KYC"])


@router.post("/submit", response_model=KYCResponse, status_code=201)
async def submit_kyc(
    request: KYCSubmitRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Submit KYC verification documents."""
    service = KYCService(db)
    kyc_record = await service.submit_kyc(
        user_id=uuid.UUID(current_user["user_id"]),
        document_type=request.document_type,
        document_number=request.document_number,
        trace_id=trace_id,
    )

    # Log audit
    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role=",".join(current_user.get("roles", [])),
        entity_type="kyc_record",
        entity_id=str(kyc_record.id),
        action="SUBMIT_KYC",
        before_state=None,
        after_state={"status": "SUBMITTED", "document_type": request.document_type},
        trace_id=trace_id,
    )

    return kyc_record


@router.get("/my-kyc", response_model=list[KYCResponse])
async def get_my_kyc(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get current user's KYC records."""
    service = KYCService(db)
    return await service.get_user_kyc(uuid.UUID(current_user["user_id"]))


@router.get("/pending", response_model=list[KYCResponse])
async def get_pending_kyc(
    page: int = 1,
    page_size: int = 20,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get pending KYC submissions for review (admin only)."""
    KYCPolicy.can_review_kyc(current_user)
    service = KYCService(db)
    offset = (page - 1) * page_size
    return await service.get_pending_reviews(offset=offset, limit=page_size)


@router.post("/{kyc_id}/approve", response_model=KYCResponse)
async def approve_kyc(
    kyc_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Approve a KYC submission (admin only)."""
    KYCPolicy.can_review_kyc(current_user)
    service = KYCService(db)

    # Start review first
    await service.start_review(kyc_id, uuid.UUID(current_user["user_id"]), trace_id)
    kyc_record = await service.approve_kyc(
        kyc_id, uuid.UUID(current_user["user_id"]), trace_id
    )

    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role="ADMIN",
        entity_type="kyc_record",
        entity_id=str(kyc_id),
        action="APPROVE_KYC",
        before_state={"status": "SUBMITTED"},
        after_state={"status": "APPROVED"},
        trace_id=trace_id,
    )

    return kyc_record


@router.post("/{kyc_id}/reject", response_model=KYCResponse)
async def reject_kyc(
    kyc_id: uuid.UUID,
    request: KYCReviewRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Reject a KYC submission (admin only)."""
    KYCPolicy.can_review_kyc(current_user)
    service = KYCService(db)

    await service.start_review(kyc_id, uuid.UUID(current_user["user_id"]), trace_id)
    kyc_record = await service.reject_kyc(
        kyc_id, uuid.UUID(current_user["user_id"]), request.rejection_reason, trace_id
    )

    from app.modules.audit.service import AuditService
    audit_service = AuditService(db)
    await audit_service.log(
        actor_id=current_user["user_id"],
        actor_role="ADMIN",
        entity_type="kyc_record",
        entity_id=str(kyc_id),
        action="REJECT_KYC",
        before_state={"status": "SUBMITTED"},
        after_state={"status": "REJECTED", "reason": request.rejection_reason},
        trace_id=trace_id,
    )

    return kyc_record
