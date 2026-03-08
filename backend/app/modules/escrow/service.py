"""
Escrow module — Service layer.
Supports INTERNAL (platform-managed) and EXTERNAL modes.
Mode controlled via platform_settings — no hardcoded logic.
"""
import uuid
from decimal import Decimal
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import EscrowError, ResourceNotFoundError
from app.modules.escrow.models import Escrow
from app.modules.escrow.repository import EscrowRepository
from app.shared.enums import EscrowMode, EscrowStatus


class EscrowService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = EscrowRepository(db)

    async def _get_escrow_mode(self) -> EscrowMode:
        """Read escrow mode from platform settings at runtime."""
        from app.modules.admin.service import AdminService
        admin_service = AdminService(self.db)
        try:
            mode_value = await admin_service.get_setting("escrow_mode")
            return EscrowMode(mode_value)
        except Exception:
            return EscrowMode.INTERNAL  # Default fallback

    async def create_escrow(
        self,
        deal_id: uuid.UUID,
        payer_id: uuid.UUID,
        payee_id: uuid.UUID,
        amount: Decimal,
        escrow_wallet_id: Optional[uuid.UUID] = None,
        trace_id: str = "",
    ) -> Escrow:
        mode = await self._get_escrow_mode()
        escrow = Escrow(
            deal_id=deal_id,
            payer_id=payer_id,
            payee_id=payee_id,
            amount=amount,
            status=EscrowStatus.PENDING,
            mode=mode,
            escrow_wallet_id=escrow_wallet_id,
        )
        return await self.repository.create(escrow)

    async def hold_escrow(self, escrow_id: uuid.UUID, trace_id: str) -> Escrow:
        """PENDING → HELD. For INTERNAL mode, funds are locked in escrow wallet."""
        escrow = await self._get_or_404(escrow_id)
        if escrow.status != EscrowStatus.PENDING:
            raise EscrowError(message=f"Cannot hold escrow in {escrow.status.value} state")

        if escrow.mode == EscrowMode.INTERNAL and escrow.escrow_wallet_id:
            from app.modules.wallet.service import WalletService
            wallet_service = WalletService(self.db)
            payer_wallet = await wallet_service.get_user_wallet(escrow.payer_id)
            await wallet_service.transfer(
                from_wallet_id=payer_wallet.id,
                to_wallet_id=escrow.escrow_wallet_id,
                amount=escrow.amount,
                transaction_type="ESCROW_HOLD",
                reference_id=str(escrow.id),
                reference_type="escrow",
                description="Escrow hold",
                trace_id=trace_id,
            )

        escrow.status = EscrowStatus.HELD
        escrow.version += 1
        return await self.repository.update(escrow)

    async def release_escrow(
        self, escrow_id: uuid.UUID, reason: Optional[str] = None, trace_id: str = ""
    ) -> Escrow:
        """HELD → RELEASED. Funds transferred to payee."""
        escrow = await self._get_or_404(escrow_id)
        if escrow.status != EscrowStatus.HELD:
            raise EscrowError(message=f"Cannot release escrow in {escrow.status.value} state")

        if escrow.mode == EscrowMode.INTERNAL and escrow.escrow_wallet_id:
            from app.modules.wallet.service import WalletService
            wallet_service = WalletService(self.db)
            payee_wallet = await wallet_service.get_user_wallet(escrow.payee_id)
            await wallet_service.transfer(
                from_wallet_id=escrow.escrow_wallet_id,
                to_wallet_id=payee_wallet.id,
                amount=escrow.amount,
                transaction_type="ESCROW_RELEASE",
                reference_id=str(escrow.id),
                reference_type="escrow",
                description="Escrow release to payee",
                trace_id=trace_id,
            )

        escrow.status = EscrowStatus.RELEASED
        escrow.release_reason = reason or "Settlement completed"
        escrow.version += 1
        return await self.repository.update(escrow)

    async def refund_escrow(
        self, escrow_id: uuid.UUID, reason: Optional[str] = None, trace_id: str = ""
    ) -> Escrow:
        """HELD → REFUNDED. Funds returned to payer."""
        escrow = await self._get_or_404(escrow_id)
        if escrow.status != EscrowStatus.HELD:
            raise EscrowError(message=f"Cannot refund escrow in {escrow.status.value} state")

        if escrow.mode == EscrowMode.INTERNAL and escrow.escrow_wallet_id:
            from app.modules.wallet.service import WalletService
            wallet_service = WalletService(self.db)
            payer_wallet = await wallet_service.get_user_wallet(escrow.payer_id)
            await wallet_service.transfer(
                from_wallet_id=escrow.escrow_wallet_id,
                to_wallet_id=payer_wallet.id,
                amount=escrow.amount,
                transaction_type="REFUND",
                reference_id=str(escrow.id),
                reference_type="escrow",
                description="Escrow refund to payer",
                trace_id=trace_id,
            )

        escrow.status = EscrowStatus.REFUNDED
        escrow.release_reason = reason or "Refund"
        escrow.version += 1
        return await self.repository.update(escrow)

    async def get_escrow(self, escrow_id: uuid.UUID) -> Escrow:
        return await self._get_or_404(escrow_id)

    async def get_deal_escrows(self, deal_id: uuid.UUID):
        return await self.repository.get_by_deal(deal_id)

    async def _get_or_404(self, escrow_id: uuid.UUID) -> Escrow:
        escrow = await self.repository.get_by_id(escrow_id)
        if not escrow:
            raise ResourceNotFoundError(message="Escrow not found")
        return escrow
