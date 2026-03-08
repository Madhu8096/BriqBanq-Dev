"""
Bids module — Service layer.
Concurrency-safe bid placement with SELECT FOR UPDATE.
Only investors can bid. Bid must exceed current highest bid.
"""
import uuid
from decimal import Decimal
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    AuctionNotLiveError,
    BidTooLowError,
    ResourceNotFoundError,
)
from app.modules.auctions.service import AuctionService
from app.modules.bids.models import Bid
from app.modules.bids.repository import BidRepository
from app.shared.enums import AuctionStatus, BidStatus


class BidService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = BidRepository(db)

    async def place_bid(
        self,
        auction_id: uuid.UUID,
        bidder_id: uuid.UUID,
        amount: Decimal,
        trace_id: str,
    ) -> Bid:
        """
        Place a bid on a live auction.
        Uses SELECT FOR UPDATE on the auction row for concurrency safety.
        - Auction must be LIVE
        - Bid must exceed current highest bid
        - Previous bids marked as OUTBID
        - Single winner enforced
        """
        auction_service = AuctionService(self.db)

        # Lock the auction row for concurrent-safe bidding
        auction = await auction_service.get_auction_for_update(auction_id)

        # Auction must be LIVE
        if auction.status != AuctionStatus.LIVE:
            raise AuctionNotLiveError()

        # Bid must exceed current highest or starting price
        minimum_bid = auction.current_highest_bid or auction.starting_price
        if auction.current_highest_bid:
            minimum_bid = auction.current_highest_bid + auction.minimum_increment

        if amount < minimum_bid:
            raise BidTooLowError(
                message=f"Bid must be at least {minimum_bid}. Current highest: {auction.current_highest_bid or 'None'}"
            )

        # Create the bid
        bid = Bid(
            auction_id=auction_id,
            bidder_id=bidder_id,
            amount=amount,
            status=BidStatus.WINNING,
        )
        bid = await self.repository.create(bid)

        # Mark all previous active/winning bids as OUTBID
        await self.repository.mark_outbid(auction_id, exclude_bid_id=bid.id)

        # Update auction's current highest bid
        await auction_service.update_highest_bid(auction_id, amount, bid.id)

        return bid

    async def get_auction_bids(self, auction_id: uuid.UUID) -> List[Bid]:
        return await self.repository.get_auction_bids(auction_id)

    async def get_user_bids(
        self, bidder_id: uuid.UUID, offset: int = 0, limit: int = 20
    ) -> List[Bid]:
        return await self.repository.get_user_bids(bidder_id, offset, limit)

    async def get_winning_bid(self, auction_id: uuid.UUID) -> Bid:
        bid = await self.repository.get_highest_bid(auction_id)
        if not bid:
            raise ResourceNotFoundError(message="No bids found for this auction")
        return bid

    async def mark_bid_won(self, bid_id: uuid.UUID) -> Bid:
        bid = await self.repository.get_by_id(bid_id)
        if not bid:
            raise ResourceNotFoundError(message="Bid not found")
        bid.status = BidStatus.WON
        bid.version += 1
        return await self.repository.update(bid)

    async def mark_bid_defaulted(self, bid_id: uuid.UUID) -> Bid:
        """Mark a winning bid as defaulted — triggers relist."""
        bid = await self.repository.get_by_id(bid_id)
        if not bid:
            raise ResourceNotFoundError(message="Bid not found")
        bid.status = BidStatus.DEFAULTED
        bid.version += 1
        return await self.repository.update(bid)

    async def validate_bid(self, investor_id: uuid.UUID, auction_id: uuid.UUID, bid_amount: Decimal) -> bool:
        from app.modules.wallet.service import WalletService
        wallet_service = WalletService(self.db)
        user_wallet = await wallet_service.get_user_wallet(investor_id)
        balance_info = await wallet_service.get_balance(user_wallet.id)
        
        if balance_info["balance"] < bid_amount:
            raise Exception("Insufficient funds")
        
        auction_service = AuctionService(self.db)
        auction = await auction_service.get_auction(auction_id)
        
        minimum_bid = auction.current_highest_bid + auction.minimum_increment if auction.current_highest_bid else auction.starting_price
        
        if bid_amount < minimum_bid:
            raise Exception("Bid too low")
            
        return True
