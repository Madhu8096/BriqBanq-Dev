"""Investor module routes."""
import uuid
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user, get_db
from app.modules.investor.schemas import PortfolioResponse
from app.modules.investor.service import InvestorService

router = APIRouter(prefix="/investor", tags=["Investor"])

@router.get("/portfolio", response_model=PortfolioResponse)
async def get_portfolio(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    service = InvestorService(db)
    return await service.get_portfolio(uuid.UUID(current_user["user_id"]))
