"""Bids module — Policies."""
from app.core.exceptions import AuthorizationError
from app.shared.enums import RoleType

class BidPolicy:
    @staticmethod
    def can_place_bid(current_user: dict) -> bool:
        """Only investors can bid."""
        if RoleType.INVESTOR.value not in current_user.get("roles", []):
            raise AuthorizationError(message="Only investors can place bids")
        return True

    @staticmethod
    def can_view_bids(current_user: dict) -> bool:
        return True
