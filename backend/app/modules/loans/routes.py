"""Loans module routes."""
import uuid
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user, get_db
from app.modules.loans.schemas import LoanRepayRequest, LoanRepayResponse
from app.modules.loans.service import LoanService

router = APIRouter(prefix="/loans", tags=["Loans"])

@router.post("/repay", response_model=LoanRepayResponse)
async def repay_loan(
    request: LoanRepayRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    service = LoanService(db)
    return await service.repay_loan(
        borrower_id=uuid.UUID(current_user["user_id"]),
        deal_id=request.deal_id,
        amount=request.amount
    )
