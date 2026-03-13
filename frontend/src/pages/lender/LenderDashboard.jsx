import React from "react";
import LenderHeroSection from "../../components/lender_dashboard/LenderHeroSection";
import LenderAlerts from "../../components/lender_dashboard/LenderAlerts";
import LenderMetricsGrid from "../../components/lender_dashboard/LenderMetricsGrid";
import LenderPortfolioTable from "../../components/lender_dashboard/LenderPortfolioTable";
import LenderRecentActivity from "../../components/lender_dashboard/LenderRecentActivity";
import LenderQuickActions from "../../components/lender_dashboard/LenderQuickActions";
import { useAuth } from "../../context/AuthContext";

export default function LenderDashboard() {
    const { user } = useAuth();
    const firstName = user?.firstName || (user?.name || "").split(' ')[0] || "User";

    return (
        <div className="space-y-3 pb-6 animate-fade-in pt-1">
            <div className="pt-1">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-0">Welcome back, {firstName}</h1>
                <p className="text-gray-500 text-[13px] font-medium leading-tight">Holistic view of your high-assurance lending portfolio and defaulted loan assets</p>
            </div>

            {/* Lender Command Center (Hero) */}
            <LenderHeroSection />

            {/* Alerts Section (Compliance & Market) */}
            <LenderAlerts />

            {/* Secondary Metrics Grid */}
            <LenderMetricsGrid />

            {/* Portfolio and Sidebar Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Main Table Area - 8 Columns */}
                <div className="xl:col-span-8 h-full">
                    <LenderPortfolioTable />
                </div>

                {/* Sidebar Area - 4 Columns */}
                <div className="xl:col-span-4 h-full flex flex-col gap-8">
                    <LenderRecentActivity />
                    <LenderQuickActions />
                </div>
            </div>
        </div>
    );
}
