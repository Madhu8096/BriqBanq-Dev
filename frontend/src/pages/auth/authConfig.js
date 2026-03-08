export const USER_ROLES = [
  { value: "borrower", label: "Borrower" },
  { value: "lender", label: "Lender" },
  { value: "investor", label: "Investor" },
  { value: "lawyer", label: "Lawyer" },
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
  { value: "receiver", label: "Receiver" },
];

export function getDashboardPath(role) {
  switch (role) {
    case "borrower": return "/borrower/dashboard";
    case "lender": return "/lender/dashboard";
    case "lawyer": return "/lawyer/dashboard";
    case "investor": return "/dashboard";
    case "admin":
    case "superadmin": return "/admin";
    case "receiver": return "/receiver";
    default: return "/dashboard";
  }
}
