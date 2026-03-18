"""
Cases module — Authorization policies.
"""

from app.core.exceptions import AuthorizationError
from app.shared.enums import RoleType


class CasePolicy:
    """Authorization policies for case operations."""

    @staticmethod
    def can_create_case(current_user: dict) -> bool:
        """Only borrowers can create cases."""
        if RoleType.BORROWER.value not in current_user.get("roles", []):
            raise AuthorizationError(
                message="Only borrowers can create cases"
            )
        return True

    @staticmethod
    def can_review_case(current_user: dict) -> bool:
        """Only admins can review cases."""
        if RoleType.ADMIN.value not in current_user.get("roles", []):
            raise AuthorizationError(
                message="Only administrators can review cases"
            )
        return True

    @staticmethod
    def can_view_case(current_user: dict, case_borrower_id: str) -> bool:
        """Borrower can view own case; admins, lawyers, lenders can view any."""
        allowed_roles = [RoleType.ADMIN.value, RoleType.LAWYER.value, RoleType.LENDER.value]
        if current_user["user_id"] == case_borrower_id:
            return True
        if any(r in current_user.get("roles", []) for r in allowed_roles):
            return True
        raise AuthorizationError(message="You do not have access to this case")

    @staticmethod
    def can_list_all_cases(current_user: dict) -> bool:
        """Only admins can list all cases."""
        if RoleType.ADMIN.value not in current_user.get("roles", []):
            raise AuthorizationError(
                message="Only administrators can list all cases"
            )
        return True

    @staticmethod
    def can_assign_participants(current_user: dict) -> bool:
        """Only admins can assign lawyers/lenders to cases."""
        if RoleType.ADMIN.value not in current_user.get("roles", []):
            raise AuthorizationError(
                message="Only administrators can assign participants"
            )
        return True
