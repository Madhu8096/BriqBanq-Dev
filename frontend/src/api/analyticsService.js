import { analyticsData } from "../data/analyticsData";

const USE_SIMULATOR = import.meta.env.VITE_USE_SIMULATOR === "true";

const simulateBackend = async (data, methodName) => {
    const delay = Math.floor(Math.random() * (1200 - 300 + 1)) + 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    // 2. Simulate Random API Failures (Disabled temporarily for user verification)
    // if (Math.random() < 0.15) { 
    //     console.error(`[REPORT API FAIL] ${methodName} after ${delay}ms`);
    //     return { success: false, error: "Database timeout during aggregation" };
    // }

    return {
        success: true,
        data: data,
        message: "OK"
    };
};

export const analyticsService = {
    getSummaryStats: async (range = "Last 30 Days") => {
        if (USE_SIMULATOR) {
            return simulateBackend(analyticsData.summary[range] || analyticsData.summary["Last 30 Days"], `getSummaryStats(${range})`);
        }
        return fetch(`/api/investor/analytics/summary?range=${range}`).then(res => res.json());
    },
    getAnalyticsCharts: async (range = "Last 30 Days") => {
        if (USE_SIMULATOR) {
            return simulateBackend(analyticsData.charts, `getAnalyticsCharts(${range})`);
        }
        return fetch(`/api/investor/analytics/charts?range=${range}`).then(res => res.json());
    },
    getRecentActivity: async () => {
        if (USE_SIMULATOR) {
            return simulateBackend(analyticsData.activity, "getRecentActivity");
        }
        return fetch("/api/investor/analytics/activity").then(res => res.json());
    },
    exportReport: async (section, format) => {
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `reports-${section.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.${format}`;

        if (USE_SIMULATOR) {
            await new Promise(resolve => setTimeout(resolve, 800));
            return {
                success: true,
                data: { fileName, url: "#" }, // Mock Download
                message: "Report generated successfully"
            };
        }
        return fetch(`/api/investor/analytics/export?section=${section}&format=${format}`).then(res => res.json());
    }
};
