import React from 'react';

export default function BidsTab({ bidHistory }) {
    return (
        <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[400px]">
            <h3 className="text-[17px] font-bold text-[#1e293b] mb-10">Bid History</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-transparent">
                            <th className="px-1 py-4 text-[13px] font-bold text-gray-900 w-1/4">Bidder</th>
                            <th className="px-1 py-4 text-[13px] font-bold text-gray-900 w-1/4">Bid Amount</th>
                            <th className="px-1 py-4 text-[13px] font-bold text-gray-900 w-1/4">Timestamp</th>
                            <th className="px-1 py-4 text-[13px] font-bold text-gray-900 w-1/4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 border-t border-gray-50">
                        {bidHistory.map((bid) => (
                            <tr key={bid.id} className="hover:bg-gray-50/30 transition-all font-sans">
                                <td className="px-1 py-6 text-[14px] font-medium text-gray-900">{bid.bidder}</td>
                                <td className="px-1 py-6 text-[14px] font-bold text-gray-900">{bid.amount}</td>
                                <td className="px-1 py-6 text-[14px] text-gray-500 font-medium">{bid.timestamp}</td>
                                <td className="px-1 py-6">
                                    <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight ${bid.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-50 text-gray-400 border border-gray-100"}`}>
                                        {bid.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
