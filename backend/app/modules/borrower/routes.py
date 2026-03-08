"""Borrower module routes."""
import uuid
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user, get_db
from app.modules.borrower.schemas import BorrowerStatsResponse, BorrowerActionsResponse
from app.modules.borrower.service import BorrowerService

router = APIRouter(prefix="/borrower", tags=["Borrower"])

@router.get("/dashboard/stats", response_model=BorrowerStatsResponse)
async def get_borrower_stats(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    service = BorrowerService(db)
    return await service.get_dashboard_stats(uuid.UUID(current_user["user_id"]))

@router.get("/dashboard/actions", response_model=BorrowerActionsResponse)
async def get_borrower_actions(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    service = BorrowerService(db)
    actions = await service.get_dashboard_actions(uuid.UUID(current_user["user_id"]))
    return {"actions": actions}
