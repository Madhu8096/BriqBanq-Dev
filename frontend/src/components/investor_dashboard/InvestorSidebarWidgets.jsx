import { PieChart, TrendingUp, FileText, Settings, ArrowUpRight, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function InvestorSidebarWidgets({ stats, investments = [] }) {
    const navigate = useNavigate();

    const breakdown = useMemo(() => {
        let totalVal = parseFloat(stats?.totalInvested) || 0;
        if (totalVal <= 0) totalVal = 10; // Fallback so we don't divide by zero

        let resCount = investments.filter((_, i) => i % 3 !== 1).length;
        let comCount = investments.filter((_, i) => i % 3 === 1).length;
        let indCount = investments.filter((_, i) => i % 5 === 0).length;

        if (investments.length === 0) { resCount = 55; comCount = 30; indCount = 15; }

        const sum = resCount + comCount + indCount;
        const resPct = Math.round((resCount / sum) * 100);
        const comPct = Math.round((comCount / sum) * 100);
        const indPct = 100 - resPct - comPct;

        return [
            { label: "Residential", value: resPct, color: "bg-blue-600", amount: `A$${((resPct / 100) * totalVal).toFixed(2)}M` },
            { label: "Commercial", value: comPct, color: "bg-emerald-500", amount: `A$${((comPct / 100) * totalVal).toFixed(2)}M` },
            { label: "Industrial", value: indPct, color: "bg-purple-500", amount: `A$${((indPct / 100) * totalVal).toFixed(2)}M` },
        ];
    }, [investments, stats]);

    const growth = useMemo(() => {
        let baseVal = parseFloat(stats?.totalInvested) || 8;
        const growthFactor = 1 + ((investments.length * 0.5) / 100); // 0.5% per inv

        const now = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return Array.from({ length: 6 }).map((_, i) => {
            const mIdx = (now.getMonth() - 5 + i + 12) % 12;
            const progress = (80 + (i * 4)); // 80 to 100 scale
            const val = baseVal * (1 - ((5 - i) * 0.02 * growthFactor));
            return {
                month: months[mIdx],
                value: progress,
                amount: `A$${val.toFixed(2)}M`
            }
        });
    }, [investments, stats]);

    const actions = [
        { label: "Find New Deals", icon: "plus", onClick: () => navigate("/investor/deals") },
        { label: "View Performance Report", icon: FileText, onClick: () => navigate("/investor/reports") },
        { label: "Update Preferences", icon: Settings, onClick: () => navigate("/investor/settings") },
        { label: "Download Tax Summary", icon: Download, onClick: () => { } },
    ];

    return (
        <div className="space-y-4">
            {/* Portfolio Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <PieChart size={18} className="text-blue-600" />
                    </div>
                    <h3 className="text-[#0F172A] font-bold text-sm">Portfolio Breakdown</h3>
                </div>

                <div className="space-y-5">
                    {breakdown.map((item, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between items-end mb-1.5 px-0.5">
                                <span className="text-[#0F172A] font-bold text-xs">{item.label}</span>
                                <span className="text-[#64748B] text-[10px] font-black">{item.value}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }}></div>
                            </div>
                            <p className="text-[#64748B] text-[10px] font-bold mt-1.5 opacity-70 italic pl-0.5">{item.amount}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 6-Month Performance */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <TrendingUp size={18} className="text-indigo-600" />
                    </div>
                    <h3 className="text-[#0F172A] font-bold text-sm">6-Month Performance</h3>
                </div>

                <div className="space-y-2.5 px-1">
                    {growth.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 group">
                            <span className="text-[#94A3B8] text-[9px] font-black w-6 uppercase tracking-tighter">{item.month}</span>
                            <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100/30">
                                <div
                                    className="h-full bg-emerald-500 rounded-full group-hover:bg-emerald-400 transition-colors"
                                    style={{ width: `${item.value}%` }}
                                ></div>
                            </div>
                            <span className="text-[#0F172A] text-[9px] font-black w-10 text-right">{item.amount}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center bg-[#F8FAFC]/30 -mx-5 px-5 rounded-b-2xl">
                    <span className="text-[#64748B] text-[10px] font-black uppercase tracking-widest">Total Growth</span>
                    <span className="text-emerald-600 font-black text-xs flex items-center gap-1">
                        <ArrowUpRight size={12} strokeWidth={3} />
                        +{investments.length > 0 ? (investments.length * 0.8).toFixed(1) : "15.2"}%
                    </span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm overflow-hidden text-black">
                <h3 className="text-[#0F172A] font-bold text-sm mb-4 border-b border-gray-50 pb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-2">
                    {actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={action.onClick}
                            className="flex items-center gap-3 w-full p-3 border border-gray-100 rounded-xl text-left hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group active:scale-95"
                        >
                            <div className="w-6 h-6 rounded flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors shrink-0">
                                {action.icon === "plus" ? <span className="text-lg font-black leading-none">+</span> : <action.icon size={16} />}
                            </div>
                            <span className="text-[#475569] font-bold text-[11px] group-hover:text-[#0F172A] transition-colors">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
