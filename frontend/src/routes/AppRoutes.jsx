import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Import dashboards (assuming standard entry points)
import BorrowerDashboard from '../pages/borrower/BorrowerDashboard';
import InvestorDashboard from '../pages/investor/InvestorDashboard';
import LenderDashboard from '../pages/lender/LenderDashboard';
import AdminDashboard from '../pages/admin/Dashboard';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Role-based routes */}
            <Route path="/borrower/*" element={<BorrowerDashboard />} />
            <Route path="/investor/*" element={<InvestorDashboard />} />
            <Route path="/lender/*" element={<LenderDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
