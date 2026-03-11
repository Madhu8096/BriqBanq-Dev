import React, { useEffect, useState } from "react";
import * as caseService from "../services/caseService";

export default function BorrowerDashboard() {
    const [cases, setCases] = useState([]);

    useEffect(() => {
        caseService.getMyCases()
            .then(res => setCases(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Borrower Dashboard</h1>
            <ul className="space-y-4">
                {cases.map((c, idx) => (
                    <li key={idx} className="border p-4 rounded shadow">
                        Case ID: {c.id} | Status: {c.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}
