import React, { useEffect, useState } from "react";
import * as adminService from "../services/adminService";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        adminService.getPlatformStats()
            .then(res => setStats(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            {stats ? (
                <pre>{JSON.stringify(stats, null, 2)}</pre>
            ) : (
                <p>Loading stats...</p>
            )}
        </div>
    );
}
