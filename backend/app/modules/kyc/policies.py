"""
KYC module — Authorization policies.
"""

from app.core.exceptions import AuthorizationError
from app.shared.enums import RoleType


class KYCPolicy:
    """Authorization policies for KYC operations."""

    @staticmethod
    def can_review_kyc(current_user: dict) -> bool:
        """Only admins can review KYC submissions."""
        if RoleType.ADMIN.value not in current_user.get("roles", []):
            raise AuthorizationError(
                message="Only administrators can review KYC submissions"
            )
        return True

    @staticmethod
    def can_view_kyc(current_user: dict, target_user_id: str) -> bool:
        """Users can view their own KYC; admins can view any."""
        if current_user["user_id"] == target_user_id:
            return True
        if RoleType.ADMIN.value in current_user.get("roles", []):
            return True
        raise AuthorizationError(
            message="You can only view your own KYC records"
        )
