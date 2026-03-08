export const analyticsData = {
    summary: {
        "Last 7 Days": {
            totalCases: 12,
            activeCases: 8,
            totalRevenue: "A$2.1M",
            avgCaseValue: "A$980K",
            totalBids: 45,
            successRate: "62%",
            trends: {
                totalCases: "+5% vs last period",
                totalRevenue: "+8% vs last period",
                successRate: "+2% vs last period"
            }
        },
        "Last 30 Days": {
            totalCases: 47,
            activeCases: 23,
            totalRevenue: "A$12.4M",
            avgCaseValue: "A$1050K",
            totalBids: 156,
            successRate: "68%",
            trends: {
                totalCases: "+12% vs last period",
                totalRevenue: "+18% vs last period",
                successRate: "+5% vs last period"
            }
        },
        "Last 90 Days": {
            totalCases: 124,
            activeCases: 45,
            totalRevenue: "A$35.2M",
            avgCaseValue: "A$1120K",
            totalBids: 412,
            successRate: "71%",
            trends: {
                totalCases: "+15% vs last period",
                totalRevenue: "+22% vs last period",
                successRate: "+7% vs last period"
            }
        },
        "This Year": {
            totalCases: 215,
            activeCases: 56,
            totalRevenue: "A$58.7M",
            avgCaseValue: "A$1090K",
            totalBids: 680,
            successRate: "74%",
            trends: {
                totalCases: "+20% vs last year",
                totalRevenue: "+25% vs last year",
                successRate: "+8% vs last year"
            }
        },
        "All Time": {
            totalCases: 842,
            activeCases: 23,
            totalRevenue: "A$245.8M",
            avgCaseValue: "A$1050K",
            totalBids: 2450,
            successRate: "72%",
            trends: {
                totalCases: "N/A",
                totalRevenue: "N/A",
                successRate: "N/A"
            }
        }
    },
    charts: {
        caseVolume: [
            { name: "Week 1", value: 40 },
            { name: "Week 2", value: 30 },
            { name: "Week 3", value: 60 },
            { name: "Week 4", value: 45 },
            { name: "Week 5", value: 70 },
            { name: "Week 6", value: 55 },
            { name: "Week 7", value: 85 }
        ],
        revenueDistribution: [
            { name: "Residential", value: 45, color: "#4F46E5" },
            { name: "Commercial", value: 30, color: "#10B981" },
            { name: "Industrial", value: 15, color: "#F59E0B" },
            { name: "Retail", value: 10, color: "#6366F1" }
        ]
    },
    activity: [
        { id: 1, title: "New case created", description: "MIP-2024-012 by Sarah Mitchell", time: "5 minutes ago" },
        { id: 2, title: "Bid placed", description: "A$1.2M bid on MIP-2024-008", time: "15 minutes ago" },
        { id: 3, title: "Contract signed", description: "MIP-2024-005 settlement proceeding", time: "1 hour ago" },
        { id: 4, title: "KYC approved", description: "David Wilson verified", time: "2 hours ago" },
        { id: 5, title: "Payment received", description: "A$850K payment processed", time: "3 hours ago" }
    ]
};
