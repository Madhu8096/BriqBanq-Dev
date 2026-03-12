import { Routes, Route, Navigate } from "react-router-dom";

// Public: Home & Auth
import HomePage from "../features/home/HomePage";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import NotFound from "../pages/NotFound";

// Borrower
import BorrowerLayout from "../features/borrower/BorrowerLayout";
import BorrowerDashboard from "../features/borrower/BorrowerDashboard";
import MyCase from "../features/borrower/MyCase";
import BorrowerContracts from "../features/borrower/Contracts";
import IdentityVerification from "../features/borrower/IdentityVerification";
import BorrowerNotifications from "../features/borrower/Notifications";
import SettingsLayout from "../features/borrower/SettingsLayout";
import ProfileSettings from "../features/borrower/settings/ProfileSettings";
import OrganizationSettings from "../features/borrower/settings/OrganizationSettings";
import SecuritySettings from "../features/borrower/settings/SecuritySettings";
import NotificationSettings from "../features/borrower/settings/NotificationSettings";
import UserManagement from "../features/borrower/settings/UserManagement";
import AccessControl from "../features/borrower/settings/AccessControl";
import ModuleSettings from "../features/borrower/settings/ModuleSettings";
import IntegrationsHub from "../features/borrower/settings/IntegrationsHub";
import IntegrationArchitecture from "../features/borrower/settings/IntegrationArchitecture";
import BorrowerESignatures from "../features/borrower/ESignatures";
import BorrowerTaskCenter from "../features/borrower/TaskCenter";
import BorrowerAuctionRoom from "../features/borrower/AuctionRoom";
import BorrowerSettings from "../features/borrower/Settings";

// Investor
import InvestorLayout from "../components/layout/InvestorLayout";
import InvestorDashboard from "../features/investor/InvestorDashboard";
import InvestorAllDeals from "../features/investor/InvestorAllDeals";
import InvestorAuctions from "../features/investor/InvestorAuctions";
import InvestorAuctionRoom from "../features/investor/InvestorAuctionRoom";
import InvestorContracts from "../features/investor/InvestorContracts";
import InvestorEscrow from "../features/investor/InvestorEscrow";
import InvestorContractSigning from "../features/investor/InvestorContractSigning";
import InvestorPlaceBid from "../features/investor/InvestorPlaceBid";
import InvestorBuyNowRoom from "../features/investor/InvestorBuyNowRoom";
import InvestorNotifications from "../features/investor/InvestorNotifications";
import InvestorSettings from "../features/investor/InvestorSettings";
import InvestorTaskCenter from "../features/investor/InvestorTaskCenter";
import InvestorCaseDetails from "../features/investor/InvestorCaseDetails";
import InvestorReports from "../features/investor/InvestorReports";
import InvestorDocuments from "../features/investor/InvestorDocuments";
import InvestorCommunications from "../features/investor/InvestorCommunications";

// Lender
import LenderLayout from "../components/layout/LenderLayout";
import LenderDashboard from "../features/lender/LenderDashboard";
import LenderAllDeals from "../features/lender/LenderAllDeals";
import LenderAuctions from "../features/lender/LenderAuctions";
import LenderAuctionRoom from "../features/lender/LenderAuctionRoom";
import LenderBuyNowRoom from "../features/lender/LenderBuyNowRoom";
import LenderContracts from "../features/lender/LenderContracts";
import LenderNotifications from "../features/lender/LenderNotifications";
import LenderSettings from "../features/lender/LenderSettings";
import LenderTaskCenter from "../features/lender/LenderTaskCenter";
import LenderMyCases from "../features/lender/LenderMyCases";
import LenderReports from "../features/lender/LenderReports";
import LenderDocuments from "../features/lender/LenderDocuments";
import LenderCommunications from "../features/lender/LenderCommunications";
import LenderESignatures from "../features/lender/LenderESignatures";
import LenderSubmitNewCase from "../features/lender/LenderSubmitNewCase";
import LenderCaseDetails from "../features/lender/LenderCaseDetails";

// Admin
import AdminDashboardLayout from "../components/admin/AdminDashboardLayout";
import AdminDashboard from "../features/admin/Dashboard";
import AdminCaseManagement from "../features/admin/CaseManagement";
import AdminAllDeals from "../features/admin/AllDeals";
import AdminAuctionControl from "../features/admin/AuctionControl";
import AdminKYCReviewQueue from "../features/admin/KYCReviewQueue";
import AdminContracts from "../features/admin/Contracts";
import ContractSigning from "../features/admin/ContractSigning";
import EscrowManagement from "../features/admin/EscrowManagement";
import DocumentLibrary from "../features/admin/DocumentLibrary";
import ReportsAnalytics from "../features/admin/ReportsAnalytics";
import AdminConsole from "../features/admin/AdminConsole";
import AdminNotifications from "../features/admin/Notifications";
import AdminSettings from "../features/admin/Settings";
import AdminProfileSettings from "../features/admin/ProfileSettings";
import AdminOrganizationSettings from "../features/admin/OrganizationSettings";
import AdminNotificationSettings from "../features/admin/NotificationSettings";
import AdminUserManagement from "../features/admin/UserManagement";
import AdminAccessControl from "../features/admin/AccessControl";
import AdminModuleSettings from "../features/admin/ModuleSettings";
import AdminIntegrationArchitecture from "../features/admin/IntegrationArchitecture";
import AdminIntegrationsHub from "../features/admin/IntegrationsHub";
import AdminAuctionRoom from "../features/admin/AuctionRoom";
import AdminBuyNowRoom from "../features/admin/BuyNowRoom";
import AdminESignatures from "../features/admin/ESignatures";

import { CaseProvider } from "../context/CaseContext";
import CaseDetailsLayout from "../features/admin/case-details/CaseDetailsLayout";
import Overview from "../features/admin/case-details/Overview";
import Property from "../features/admin/case-details/Property";
import Documents from "../features/admin/case-details/Documents";
import InvestmentMemorandum from "../features/admin/case-details/InvestmentMemorandum";
import Settlement from "../features/admin/case-details/Settlement";
import Bids from "../features/admin/case-details/Bids";
import Messages from "../features/admin/case-details/Messages";
import Activity from "../features/admin/case-details/Activity";

// Lawyer
import LawyerLayout from "../features/lawyer/LawyerLayout.jsx";
import LawyerDashboard from "../features/lawyer/Dashboard.jsx";
import LawyerAssignedCases from "../features/lawyer/AssignedCases";
import LawyerCaseDetail from "../features/lawyer/CaseDetail";
import LawyerESignatures from "../features/lawyer/ESignatures";
import LawyerTaskCenter from "../features/lawyer/TaskCenter";
import LawyerContractReview from "../features/lawyer/ContractReview";
import LawyerNotifications from "../features/lawyer/Notifications";
import LawyerSettings from "../features/lawyer/Settings";
import LawyerKYCReview from "../features/lawyer/KYCReview";
import LawyerReports from "../features/lawyer/Reports";
import LawyerAdminConsole from "../features/lawyer/AdminConsole";

// Receiver
import ReceiverDashboard from "../features/receiver/ReceiverDashboard";

import RouteErrorBoundary from "../components/common/RouteErrorBoundary";

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
        <Route path="case-details/:caseId" element={<CaseProvider><CaseDetailsLayout /></CaseProvider>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="property" element={<Property />} />
          <Route path="documents" element={<Documents />} />
          <Route path="investment-memorandum" element={<InvestmentMemorandum />} />
          <Route path="settlement" element={<Settlement />} />
          <Route path="bids" element={<Bids />} />
          <Route path="messages" element={<Messages />} />
          <Route path="activity" element={<Activity />} />
        </Route>
        <Route path="all-deals" element={<AdminAllDeals />} />
        <Route path="auction-control" element={<AdminAuctionControl />} />
        <Route path="auction-room/:id" element={<AdminAuctionRoom />} />
        <Route path="buy-now-room/:id" element={<AdminBuyNowRoom />} />
        <Route path="kyc-review" element={<AdminKYCReviewQueue />} />
        <Route path="contracts" element={<AdminContracts />} />
        <Route path="contracts/:id" element={<ContractSigning />} />
        <Route path="escrow-management" element={<EscrowManagement />} />
        <Route path="document-library" element={<DocumentLibrary />} />
        <Route path="reports-analytics" element={<ReportsAnalytics />} />
        <Route path="admin-console" element={<AdminConsole />} />
        <Route path="e-signatures" element={<AdminESignatures />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="settings/profile" element={<AdminProfileSettings />} />
        <Route path="settings/organization" element={<AdminOrganizationSettings />} />
        <Route path="settings/notifications" element={<AdminNotificationSettings />} />
        <Route path="settings/users" element={<AdminUserManagement />} />
        <Route path="settings/access-control" element={<AdminAccessControl />} />
        <Route path="settings/modules" element={<AdminModuleSettings />} />
        <Route path="integration-architecture" element={<AdminIntegrationArchitecture />} />
        <Route path="integrations" element={<AdminIntegrationsHub />} />
      </Route>

      {/* Borrower Routes */}
      <Route path="/borrower" element={<RouteErrorBoundary routeLabel="the borrower panel"><BorrowerLayout /></RouteErrorBoundary>}>
        <Route index element={<Navigate to="/borrower/dashboard" replace />} />
        <Route path="dashboard" element={<BorrowerDashboard />} />
        <Route path="my-case" element={<MyCase />} />
        <Route path="contracts" element={<BorrowerContracts />} />
        <Route path="identity-verification" element={<IdentityVerification />} />
        <Route path="notifications" element={<BorrowerNotifications />} />
        <Route path="e-signatures" element={<BorrowerESignatures />} />
        <Route path="task-center" element={<BorrowerTaskCenter />} />
        <Route path="auction" element={<BorrowerAuctionRoom />} />
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<BorrowerSettings />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="organization" element={<OrganizationSettings />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="notifications" element={<NotificationSettings />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="access-control" element={<AccessControl />} />
          <Route path="module-settings" element={<ModuleSettings />} />
          <Route path="integrations" element={<IntegrationsHub />} />
          <Route path="integration-architecture" element={<IntegrationArchitecture />} />
        </Route>
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
        <Route path="contracts/:id" element={<InvestorContractSigning />} />
        <Route path="place-bid/:id" element={<InvestorPlaceBid />} />
        <Route path="buy-now/:id" element={<InvestorBuyNowRoom />} />
        <Route path="notifications" element={<InvestorNotifications />} />
        <Route path="settings" element={<InvestorSettings />} />
        <Route path="tasks" element={<InvestorTaskCenter />} />
        <Route path="case-details/:id" element={<InvestorCaseDetails />} />
        <Route path="reports" element={<InvestorReports />} />
        <Route path="documents" element={<InvestorDocuments />} />
        <Route path="communications" element={<InvestorCommunications />} />
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
        <Route path="tasks" element={<LenderTaskCenter />} />
        <Route path="my-cases" element={<LenderMyCases />} />
        <Route path="reports" element={<LenderReports />} />
        <Route path="documents" element={<LenderDocuments />} />
        <Route path="communications" element={<LenderCommunications />} />
        <Route path="e-signatures" element={<LenderESignatures />} />
        <Route path="submit-case" element={<LenderSubmitNewCase />} />
        <Route path="case-details/:id" element={<LenderCaseDetails />} />
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

      <Route path="/receiver" element={<ReceiverDashboard />} />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
