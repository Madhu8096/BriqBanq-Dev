import { Routes, Route, Navigate } from "react-router-dom";
import InvestorDashboard from "../pages/investor/InvestorDashboard";
import InvestorPlaceBid from "../pages/investor/InvestorPlaceBid";
import InvestorAllDeals from "../pages/investor/InvestorAllDeals";
import InvestorAuctions from "../pages/investor/InvestorAuctions";
import InvestorLayout from "../components/layout/InvestorLayout";
import LenderLayout from "../components/layout/LenderLayout";
import InvestorContracts from "../pages/investor/InvestorContracts";
import InvestorContractSigning from "../pages/investor/InvestorContractSigning";
import InvestorEscrow from "../pages/investor/InvestorEscrow";
import InvestorAuctionRoom from "../pages/investor/InvestorAuctionRoom";
import InvestorBuyNowRoom from "../pages/investor/InvestorBuyNowRoom";
import InvestorNotifications from "../pages/investor/InvestorNotifications";
import InvestorSettings from "../pages/investor/InvestorSettings";
import InvestorTaskCenter from "../pages/investor/InvestorTaskCenter";
import InvestorReports from "../pages/investor/InvestorReports";
import InvestorDocuments from "../pages/investor/InvestorDocuments";
import InvestorCaseDetails from "../pages/investor/InvestorCaseDetails";

// Lender Imports
import LenderDashboard from "../pages/lender/LenderDashboard";
import LenderAllDeals from "../pages/lender/LenderAllDeals";
import LenderAuctions from "../pages/lender/LenderAuctions";
import LenderAuctionRoom from "../pages/lender/LenderAuctionRoom";
import LenderBuyNowRoom from "../pages/lender/LenderBuyNowRoom";
import LenderContracts from "../pages/lender/LenderContracts";


import LenderNotifications from "../pages/lender/LenderNotifications";
import LenderSettings from "../pages/lender/LenderSettings";

// Lawyer Panel
import LawyerLayout from "../pages/lawyer/LawyerLayout.jsx";
import LawyerDashboard from "../pages/lawyer/Dashboard.jsx";
import LawyerAssignedCases from "../pages/lawyer/AssignedCases";
import LawyerCaseDetail from "../pages/lawyer/CaseDetail";
import LawyerESignatures from "../pages/lawyer/ESignatures";
import LawyerTaskCenter from "../pages/lawyer/TaskCenter";
import LawyerContractReview from "../pages/lawyer/ContractReview";
import LawyerNotifications from "../pages/lawyer/Notifications";
import LawyerSettings from "../pages/lawyer/Settings";
import LawyerKYCReview from "../pages/lawyer/KYCReview";
import LawyerReports from "../pages/lawyer/Reports";
import LawyerAdminConsole from "../pages/lawyer/AdminConsole";

import NotFound from "../pages/NotFound";
import HomePage from "../pages/home/HomePage";
import RouteErrorBoundary from "../components/common/RouteErrorBoundary";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import ReceiverDashboard from "../pages/receiver/ReceiverDashboard";

import AdminDashboardLayout from "../components/admin/AdminDashboardLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminCaseManagement from "../pages/admin/CaseManagement";
import AdminAllDeals from "../pages/admin/AllDeals";
import AdminAuctionControl from "../pages/admin/AuctionControl";
import AdminKYCReviewQueue from "../pages/admin/KYCReviewQueue";
import AdminContracts from "../pages/admin/Contracts";
import AdminEscrowManagement from "../pages/admin/EscrowManagement";
import AdminDocumentLibrary from "../pages/admin/DocumentLibrary";
import AdminReportsAnalytics from "../pages/admin/ReportsAnalytics";
import AdminNotifications from "../pages/admin/Notifications";
import AdminSettings from "../pages/admin/Settings";
import AdminConsole from "../pages/admin/AdminConsole";
import AdminESignatures from "../pages/admin/ESignatures";

// Borrower Imports
import BorrowerLayout from "../pages/borrower/BorrowerLayout";
import BorrowerDashboard from "../pages/borrower/BorrowerDashboard";
import MyCase from "../pages/borrower/MyCase";
import BorrowerESignatures from "../pages/borrower/ESignatures";
import BorrowerContracts from "../pages/borrower/Contracts";
import IdentityVerification from "../pages/borrower/IdentityVerification";
import BorrowerTaskCenter from "../pages/borrower/TaskCenter";
import BorrowerAuctionRoom from "../pages/borrower/AuctionRoom";
import BorrowerNotifications from "../pages/borrower/Notifications";
import BorrowerSettings from "../pages/borrower/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public: Home & Auth */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Admin Panel */}
      <Route path="/admin" element={<RouteErrorBoundary routeLabel="the admin panel"><AdminDashboardLayout /></RouteErrorBoundary>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="case-management" element={<AdminCaseManagement />} />
        <Route path="all-deals" element={<AdminAllDeals />} />
        <Route path="auction-control" element={<AdminAuctionControl />} />
        <Route path="kyc-review" element={<AdminKYCReviewQueue />} />
        <Route path="contracts" element={<AdminContracts />} />
        <Route path="escrow-management" element={<AdminEscrowManagement />} />
        <Route path="document-library" element={<AdminDocumentLibrary />} />
        <Route path="reports-analytics" element={<AdminReportsAnalytics />} />
        <Route path="e-signatures" element={<AdminESignatures />} />
        <Route path="admin-console" element={<AdminConsole />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>



      {/* Borrower Routes */}
      <Route path="/borrower" element={<RouteErrorBoundary routeLabel="the borrower panel"><BorrowerLayout /></RouteErrorBoundary>}>
        <Route index element={<Navigate to="/borrower/dashboard" replace />} />
        <Route path="dashboard" element={<BorrowerDashboard />} />
        <Route path="my-case" element={<MyCase />} />
        <Route path="e-signatures" element={<BorrowerESignatures />} />
        <Route path="contracts" element={<BorrowerContracts />} />
        <Route path="identity-verification" element={<IdentityVerification />} />
        <Route path="task-center" element={<BorrowerTaskCenter />} />
        <Route path="auction" element={<BorrowerAuctionRoom />} />
        <Route path="notifications" element={<BorrowerNotifications />} />
        <Route path="settings" element={<BorrowerSettings />} />
      </Route>

      {/* Investor Routes Layout */}
      <Route path="/investor" element={<InvestorLayout />}>
        <Route index element={<Navigate to="/investor/dashboard" replace />} />
        <Route path="dashboard" element={<InvestorDashboard />} />
        <Route path="deals" element={<InvestorAllDeals />} />
        <Route path="auctions" element={<InvestorAuctions />} />
        <Route path="auctions/:id" element={<InvestorAuctionRoom />} />
        <Route path="contracts" element={<InvestorContracts />} />
        <Route path="escrow" element={<InvestorEscrow />} />
        <Route path="tasks" element={<InvestorTaskCenter />} />
        <Route path="reports" element={<InvestorReports />} />
        <Route path="documents" element={<InvestorDocuments />} />
        <Route path="contracts/:id" element={<InvestorContractSigning />} />
        <Route path="place-bid/:id" element={<InvestorPlaceBid />} />
        <Route path="buy-now/:id" element={<InvestorBuyNowRoom />} />
        <Route path="case-details/:id" element={<InvestorCaseDetails />} />
        <Route path="notifications" element={<InvestorNotifications />} />
        <Route path="settings" element={<InvestorSettings />} />
      </Route>

      {/* Lender Routes Layout */}
      <Route path="/lender" element={<LenderLayout />}>
        <Route index element={<Navigate to="/lender/dashboard" replace />} />
        <Route path="dashboard" element={<LenderDashboard />} />
        <Route path="deals" element={<LenderAllDeals />} />
        <Route path="auctions" element={<LenderAuctions />} />
        <Route path="auctions/:id" element={<LenderAuctionRoom />} />
        <Route path="buy-now/:id" element={<LenderBuyNowRoom />} />
        <Route path="contracts" element={<LenderContracts />} />
        <Route path="notifications" element={<LenderNotifications />} />
        <Route path="settings" element={<LenderSettings />} />
      </Route>

      {/* Lawyer Panel */}
      <Route path="/lawyer" element={<RouteErrorBoundary routeLabel="the lawyer panel"><LawyerLayout /></RouteErrorBoundary>}>
        <Route index element={<Navigate to="/lawyer/dashboard" replace />} />
        <Route path="dashboard" element={<LawyerDashboard />} />
        <Route path="kyc-review" element={<LawyerKYCReview />} />
        <Route path="reports" element={<LawyerReports />} />
        <Route path="admin-console" element={<LawyerAdminConsole />} />
        <Route path="assigned-cases" element={<LawyerAssignedCases />} />
        <Route path="assigned-cases/:caseId" element={<LawyerCaseDetail />} />
        <Route path="e-signatures" element={<LawyerESignatures />} />
        <Route path="contract-review" element={<LawyerContractReview />} />
        <Route path="task-center" element={<LawyerTaskCenter />} />
        <Route path="notifications" element={<LawyerNotifications />} />
        <Route path="settings" element={<LawyerSettings />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="/invester/*" element={<Navigate to="/investor" replace />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}
