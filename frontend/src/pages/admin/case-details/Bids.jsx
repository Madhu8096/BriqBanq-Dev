// src/pages/admin/case-details/Bids.jsx
import { useCaseContext } from '../../../context/CaseContext'
import { Search, Filter, ArrowUpRight, Users, Gavel, Target, Banknote, MoreHorizontal, DownloadCloud, Trophy } from 'lucide-react'

export default function Bids() {
    const { caseData } = useCaseContext()

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-AU', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    const bidStats = [
        { label: 'Active Capitalists', value: new Set(caseData.bids.map(b => b.bidder)).size, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Execution Velocity', value: `${caseData.bids.length} Offers`, icon: Gavel, color: 'text-gray-900', bg: 'bg-gray-100' },
        { label: 'Liquidation Floor', value: formatCurrency(caseData.valuation.amount * 0.9), icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Peak Liquidity', value: formatCurrency(caseData.financial.currentHighestBid), icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50' }
    ]

    return (
        <div className="space-y-12">
            {/* Auction Command Center */}
            <div className="space-y-8">
                <div className="flex items-end justify-between px-2">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Live Auction Oversight</p>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Capital Flow Monitor</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {bidStats.map((stat, i) => (
                        <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group">
                            <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-gray-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">{stat.label}</p>
                                    <p className="text-lg font-black text-gray-900 tracking-tight">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* High-Contrast Bid Ledger */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                {/* Tactical Search/Filter Bar */}
                <div className="p-8 border-b border-gray-50 bg-white flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="relative w-full max-w-xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search verified bidders, offer IDs, or liquidation tags..."
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-[11px] font-medium placeholder:text-gray-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                        />
                    </div>
                    <div className="flex gap-3 w-full lg:w-auto">
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-gray-900 transition-all">
                            <Filter className="w-4 h-4 text-indigo-400" />
                            Filters
                        </button>
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                            <DownloadCloud className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Ledger Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/30 border-b border-gray-50">
                                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Priority</th>
                                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Executing Capitalist</th>
                                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Bid Quantum</th>
                                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Chronological Stamp</th>
                                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {caseData.bids && caseData.bids.length > 0 ? (
                                caseData.bids.map((bid, index) => (
                                    <tr key={bid.id || index} className={`group hover:bg-indigo-50/30 transition-all duration-300 ${index === 0 ? 'bg-indigo-50/10' : ''}`}>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <span className={`text-base font-black italic ${index === 0 ? 'text-indigo-600' : 'text-gray-200'}`}>
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                {index === 0 && (
                                                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xs font-black shadow-sm transform group-hover:rotate-[10deg] transition-all duration-500
                                                    ${index === 0 ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'bg-white border border-gray-100 text-gray-400'}
                                                `}>
                                                    {bid.bidder.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{bid.bidder}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                        <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest">KYC Authenticated • Tier {index === 0 ? '01' : '02'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-2xl font-black tracking-tighter ${index === 0 ? 'text-emerald-500 underline underline-offset-8 decoration-emerald-200' : 'text-gray-900'}`}>
                                                    {formatCurrency(bid.amount)}
                                                </span>
                                                {index === 0 && <Trophy className="w-5 h-5 text-amber-400 drop-shadow-sm" />}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-gray-500 tracking-tight">{formatDate(bid.timestamp).split(',')[0]}</p>
                                                <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">{formatDate(bid.timestamp).split(',')[1]}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex flex-col items-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                                <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm
                                                    ${bid.status === 'winning'
                                                        ? 'bg-indigo-600 text-white shadow-indigo-100'
                                                        : 'bg-white border border-gray-100 text-gray-400'}
                                                `}>
                                                    {bid.status === 'winning' ? 'Superior Offer' : 'Suppressed'}
                                                </span>
                                                <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 border border-gray-100 mb-2">
                                                <Gavel className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">No Bids Placed</h3>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] max-w-[200px] mx-auto leading-relaxed">The auction floor is currently quiet. Capital flow monitoring will resume upon activity.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Tactical Footer */}
                <div className="p-10 border-t border-gray-50 bg-gray-50/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Bid Stream Active</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Displaying {caseData.bids.length} of {caseData.bids.length} Records</p>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">1</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
