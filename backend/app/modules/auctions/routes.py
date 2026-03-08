"""
Auctions module — FastAPI routes.
"""
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.core.dependencies import get_current_user, get_db, get_trace_id
from app.modules.auctions.policies import AuctionPolicy
from app.modules.auctions.schemas import AuctionCreateRequest, AuctionListResponse, AuctionResponse
from app.modules.auctions.service import AuctionService
from app.shared.enums import AuctionStatus

router = APIRouter(prefix="/auctions", tags=["Auctions"])

@router.get("/{auction_id}/winner")
async def get_auction_winner(
    auction_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    service = AuctionService(db)
    return await service.get_auction_winner(auction_id)

@router.post("/{auction_id}/close", response_model=AuctionResponse)
async def close_auction(
    auction_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db), trace_id: str = Depends(get_trace_id),
):
    AuctionPolicy.can_manage_auction(current_user)
    service = AuctionService(db)
    return await service.close_auction_flow(auction_id, trace_id)



@router.post("/", response_model=AuctionResponse, status_code=201)
async def create_auction(
    request: AuctionCreateRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    AuctionPolicy.can_manage_auction(current_user)
    service = AuctionService(db)
    auction = await service.create_auction(
        deal_id=request.deal_id, title=request.title,
        starting_price=request.starting_price, minimum_increment=request.minimum_increment,
        scheduled_start=request.scheduled_start, scheduled_end=request.scheduled_end,
        created_by=uuid.UUID(current_user["user_id"]), trace_id=trace_id,
    )
    from app.modules.audit.service import AuditService
    await AuditService(db).log(
        actor_id=current_user["user_id"], actor_role="ADMIN",
        entity_type="auction", entity_id=str(auction.id),
        action="CREATE_AUCTION", before_state=None,
        after_state={"status": "SCHEDULED", "deal_id": str(request.deal_id)},
        trace_id=trace_id,
    )
    return auction


@router.post("/{auction_id}/start", response_model=AuctionResponse)
async def start_auction(
    auction_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db), trace_id: str = Depends(get_trace_id),
):
    AuctionPolicy.can_manage_auction(current_user)
    service = AuctionService(db)
    auction = await service.start_auction(auction_id, trace_id)
    from app.modules.audit.service import AuditService
    await AuditService(db).log(
        actor_id=current_user["user_id"], actor_role="ADMIN",
        entity_type="auction", entity_id=str(auction_id),
        action="START_AUCTION", before_state={"status": "SCHEDULED"},
        after_state={"status": "LIVE"}, trace_id=trace_id,
    )
    return auction


@router.post("/{auction_id}/pause", response_model=AuctionResponse)
async def pause_auction(
    auction_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db), trace_id: str = Depends(get_trace_id),
):
    AuctionPolicy.can_manage_auction(current_user)
    service = AuctionService(db)
    auction = await service.pause_auction(auction_id, trace_id)
    from app.modules.audit.service import AuditService
    await AuditService(db).log(
        actor_id=current_user["user_id"], actor_role="ADMIN",
        entity_type="auction", entity_id=str(auction_id),
        action="PAUSE_AUCTION", before_state={"status": "LIVE"},
        after_state={"status": "PAUSED"}, trace_id=trace_id,
    )
    return auction


@router.post("/{auction_id}/resume", response_model=AuctionResponse)
async def resume_auction(
    auction_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db), trace_id: str = Depends(get_trace_id),
):
    AuctionPolicy.can_manage_auction(current_user)
    service = AuctionService(db)
    auction = await service.resume_auction(auction_id, trace_id)
    from app.modules.audit.service import AuditService
    await AuditService(db).log(
        actor_id=current_user["user_id"], actor_role="ADMIN",
        entity_type="auction", entity_id=str(auction_id),
        action="RESUME_AUCTION", before_state={"status": "PAUSED"},
        after_state={"status": "LIVE"}, trace_id=trace_id,
    )
    return auction


@router.post("/{auction_id}/end", response_model=AuctionResponse)
async def end_auction(
    auction_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db), trace_id: str = Depends(get_trace_id),
):
    AuctionPolicy.can_manage_auction(current_user)
    service = AuctionService(db)
    auction = await service.end_auction(auction_id, trace_id)
    from app.modules.audit.service import AuditService
    await AuditService(db).log(
        actor_id=current_user["user_id"], actor_role="ADMIN",
        entity_type="auction", entity_id=str(auction_id),
        action="END_AUCTION", before_state={"status": "LIVE"},
        after_state={"status": "ENDED"}, trace_id=trace_id,
    )
    return auction


@router.get("/", response_model=AuctionListResponse)
async def list_auctions(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user), db=Depends(get_db),
):
    service = AuctionService(db)
    auction_status = AuctionStatus(status) if status else None
    offset = (page - 1) * page_size
    auctions, total = await service.get_all_auctions(status=auction_status, offset=offset, limit=page_size)
    return AuctionListResponse(items=auctions, total=total, page=page, page_size=page_size)


@router.get("/{auction_id}", response_model=AuctionResponse)
async def get_auction(
    auction_id: uuid.UUID,
    current_user: dict = Depends(get_current_user), db=Depends(get_db),
):
    service = AuctionService(db)
    return await service.get_auction(auction_id)
