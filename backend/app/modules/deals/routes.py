"""
Deals module — FastAPI routes.
"""

import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_current_user, get_db, get_trace_id
from app.modules.deals.policies import DealPolicy
from app.modules.deals.schemas import (
    DealCreateRequest,
    DealListResponse,
    DealResponse,
    DealUpdateRequest,
)
from app.modules.deals.service import DealService
from app.shared.enums import DealStatus

router = APIRouter(prefix="/deals", tags=["Deals"])


@router.post("/", response_model=DealResponse, status_code=201)
async def create_deal(
    request: DealCreateRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Create a deal from an approved case (admin only)."""
    DealPolicy.can_create_deal(current_user)

    # Verify case is approved
    from app.modules.cases.service import CaseService
    case_service = CaseService(db)
    case = await case_service.get_case(request.case_id)

    service = DealService(db)
    deal = await service.create_deal(
        case_id=request.case_id,
        title=request.title,
        description=request.description,
        asking_price=request.asking_price,
        reserve_price=request.reserve_price,
        seller_id=case.borrower_id,
        created_by=uuid.UUID(current_user["user_id"]),
        trace_id=trace_id,
    )

    from app.modules.audit.service import AuditService
    await AuditService(db).log(
        actor_id=current_user["user_id"],
        actor_role="ADMIN",
        entity_type="deal",
        entity_id=str(deal.id),
        action="CREATE_DEAL",
        before_state=None,
        after_state={"status": "DRAFT", "case_id": str(request.case_id)},
        trace_id=trace_id,
    )

    return deal


@router.post("/{deal_id}/list", response_model=DealResponse)
async def list_deal(
    deal_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """List a deal for auction (admin only)."""
    DealPolicy.can_manage_deal(current_user)
    service = DealService(db)
    deal = await service.list_deal(deal_id, trace_id)

    from app.modules.audit.service import AuditService
    await AuditService(db).log(
        actor_id=current_user["user_id"], actor_role="ADMIN",
        entity_type="deal", entity_id=str(deal_id),
        action="LIST_DEAL",
        before_state={"status": "DRAFT"}, after_state={"status": "LISTED"},
        trace_id=trace_id,
    )
    return deal


@router.post("/{deal_id}/close", response_model=DealResponse)
async def close_deal(
    deal_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Close a deal (admin only)."""
    DealPolicy.can_manage_deal(current_user)
    service = DealService(db)
    deal = await service.close_deal(deal_id, trace_id)

    from app.modules.audit.service import AuditService
    await AuditService(db).log(
        actor_id=current_user["user_id"], actor_role="ADMIN",
        entity_type="deal", entity_id=str(deal_id),
        action="CLOSE_DEAL",
        before_state=None, after_state={"status": "CLOSED"},
        trace_id=trace_id,
    )
    return deal


@router.get("/", response_model=DealListResponse)
async def list_all_deals(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """List all deals."""
    service = DealService(db)
    
    # Enforce investor visibility: non-admins only see LISTED deals
    user_roles = current_user.get("roles", [])
    is_admin = "ADMIN" in user_roles or current_user.get("is_admin", False)
    
    if not is_admin:
        if status and status != DealStatus.LISTED.value:
            # Investors/Lenders searching for non-public statuses get empty result
            return DealListResponse(items=[], total=0, page=page, page_size=page_size)
        deal_status = DealStatus.LISTED
    else:
        deal_status = DealStatus(status) if status else None

    offset = (page - 1) * page_size
    deals, total = await service.get_all_deals(status=deal_status, offset=offset, limit=page_size)
    
    # Explicit conversion to Pydantic objects to fix type errors
    return DealListResponse(
        items=[DealResponse.model_validate(d) for d in deals],
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{deal_id}", response_model=DealResponse)
async def get_deal(
    deal_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get a specific deal."""
    service = DealService(db)
    return await service.get_deal(deal_id)
