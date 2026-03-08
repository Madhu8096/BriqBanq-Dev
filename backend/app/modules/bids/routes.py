"""Bids module — FastAPI routes."""
import uuid
from fastapi import APIRouter, Depends, Query
from app.core.dependencies import get_current_user, get_db, get_trace_id
from app.modules.bids.policies import BidPolicy
from app.modules.bids.schemas import BidPlaceRequest, BidResponse, BidListResponse, BidValidationRequest
from app.modules.bids.service import BidService

router = APIRouter(prefix="/bids", tags=["Bids"])

@router.post("/validate")
async def validate_bid_endpoint(
    request: BidValidationRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    service = BidService(db)
    is_valid = await service.validate_bid(
        investor_id=uuid.UUID(current_user["user_id"]),
        auction_id=request.auction_id,
        bid_amount=request.amount
    )
    return {"valid": is_valid}


@router.post("/place", response_model=BidResponse, status_code=201)
async def place_bid(
    request: BidPlaceRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
    trace_id: str = Depends(get_trace_id),
):
    """Place a bid on a live auction (investor only)."""
    BidPolicy.can_place_bid(current_user)
    service = BidService(db)
    bid = await service.place_bid(
        auction_id=request.auction_id,
        bidder_id=uuid.UUID(current_user["user_id"]),
        amount=request.amount,
        trace_id=trace_id,
    )
    from app.modules.audit.service import AuditService
    await AuditService(db).log(
        actor_id=current_user["user_id"], actor_role="INVESTOR",
        entity_type="bid", entity_id=str(bid.id),
        action="PLACE_BID",
        before_state=None,
        after_state={"auction_id": str(request.auction_id), "amount": str(request.amount), "status": "WINNING"},
        trace_id=trace_id,
    )
    return bid


@router.get("/auction/{auction_id}", response_model=list[BidResponse])
async def get_auction_bids(
    auction_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    service = BidService(db)
    return await service.get_auction_bids(auction_id)


@router.get("/my-bids", response_model=list[BidResponse])
async def get_my_bids(
    page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    service = BidService(db)
    offset = (page - 1) * page_size
    return await service.get_user_bids(uuid.UUID(current_user["user_id"]), offset, page_size)
