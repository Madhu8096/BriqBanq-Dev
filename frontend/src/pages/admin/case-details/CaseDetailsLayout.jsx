// src/pages/admin/case-details/CaseDetailsLayout.jsx
import { useState } from 'react'
import { Outlet, useNavigate, useParams, useLocation, NavLink } from 'react-router-dom'
import {
    ChevronLeft, Home, Building2, FileText, FileCheck, Shield,
    DollarSign, MessageSquare, Activity, Download, Settings, BarChart3, Users
} from 'lucide-react'
import { useCaseContext } from '../../../context/CaseContext'
import ManageCaseModal from '../../../components/admin/case/ManageCaseModal'
import { caseService } from '../../../api/dataService'

const tabs = [
    { label: 'Overview', icon: Home, path: 'overview' },
    { label: 'Property', icon: Building2, path: 'property' },
    { label: 'Documents', icon: FileText, path: 'documents' },
    { label: 'Investment Memo', icon: FileCheck, path: 'investment-memorandum' },
    { label: 'Settlement', icon: Shield, path: 'settlement' },
    { label: 'Bids', icon: DollarSign, path: 'bids' },
    { label: 'Messages', icon: MessageSquare, path: 'messages' },
    { label: 'Activity', icon: Activity, path: 'activity' },
]

export default function CaseDetailsLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { caseData, loading } = useCaseContext()
    const [isManageModalOpen, setIsManageModalOpen] = useState(false)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!caseData) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50 space-y-4">
            <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500">
                <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Case Not Found</h2>
            <button onClick={() => navigate('/admin/case-management')} className="text-indigo-600 font-black uppercase tracking-widest text-xs border-b-2 border-indigo-100 pb-1">Return to Case Management</button>
        </div>
    )

    const handleExportReport = async () => {
        try {
            const result = await caseService.exportCaseReport(caseData.id);
            if (result instanceof Blob) {
                const url = URL.createObjectURL(result);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Case-Report-${caseData.id}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert("Export failed: " + (result?.error || "No data received"));
            }
        } catch (err) {
            console.error("Export error:", err);
            alert("Failed to export report.");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF] pb-24">
            {/* Top Navigation Context */}
            {/* Top Navigation Context */}
            <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-12">

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/admin/case-management')}
                            className="group flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 hover:shadow-lg transition-all duration-300"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Return to Case Management
                        </button>
                        <div className="h-6 w-px bg-gray-100" />
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Admin Control</span>
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-900 pb-0.5 px-0.5">Case Operations</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                         <button 
                            onClick={handleExportReport}
                            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 hover:shadow-lg transition-all"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 hover:shadow-lg transition-all">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Case Master Header */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-white relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-indigo-50/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                                    {caseData.id.length > 20 ? `${caseData.id.substring(0, 8)}...${caseData.id.substring(caseData.id.length - 8)}` : caseData.id}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <span className="px-5 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-indigo-100">
                                        {caseData.status}
                                    </span>
                                    <span className={`px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border shadow-sm
                                        ${(caseData.risk_level || caseData.risk) === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                                            (caseData.risk_level || caseData.risk) === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-emerald-50 text-emerald-600 border-emerald-100'}
                                    `}>
                                        {caseData.risk_level || caseData.risk || 'Medium'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0 border border-gray-100">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <p className="text-xl text-gray-500 font-medium leading-relaxed">
                                        {caseData.property.address}
                                        {caseData.property.suburb && <>, <span className="text-gray-900 font-bold">{caseData.property.suburb}</span></>}
                                        {caseData.property.state && <>, {caseData.property.state}</>}
                                        {caseData.property.postcode && <> {caseData.property.postcode}</>}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="bg-gray-50 rounded-2xl p-4 flex gap-6 items-center border border-gray-100 px-8 h-[72px]">
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-indigo-600" />
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Stakeholders</p>
                                        <div className="flex -space-x-2 mt-1">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-5 h-5 rounded lg bg-indigo-200 border-2 border-white flex items-center justify-center text-[7px] font-black">ST</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-px h-6 bg-gray-200" />
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Engagement</p>
                                        <p className="text-[10px] font-black text-gray-900 mt-0.5">High Velocity</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsManageModalOpen(true)}
                                className="group relative px-10 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all duration-500 shadow-xl shadow-gray-200 w-full sm:w-auto h-[72px]"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Manage Infrastructure
                                    <Settings className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-12 py-8 border-t border-gray-50 relative z-10">
                        {[
                            { label: 'Primary Borrower', value: caseData.borrower_name || caseData.borrower.name, sub: 'Identity Verified' },
                            { label: 'Assigned Lender', value: caseData.lender_name || caseData.lender.name, sub: 'Agreement Active' },
                            { label: 'Outstanding Debt', value: formatCurrency(caseData.outstanding_debt || caseData.loan.outstandingDebt), sub: `LTV Ratio: ${caseData.loan.ltv}%` },
                            { label: 'Verified Valuation', value: formatCurrency(caseData.estimated_value || caseData.valuation.amount), sub: 'Updated from source' }
                        ].map((item, i) => (
                            <div key={i}>
                                <p className="text-[9px] text-gray-300 uppercase font-black tracking-widest mb-2">{item.label}</p>
                                <p className="text-lg font-black text-gray-900 tracking-tight">{item.value}</p>
                                <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-1">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vertical Workspace Strategy */}
                <div className="mt-12 space-y-8">
                    {/* Floating Navigation Strategy */}
                    <div className="flex items-center justify-center w-full">
                        <div className="flex gap-2 bg-[#F5F7FF] p-2 rounded-3xl shadow-sm border border-indigo-50/50 overflow-x-auto max-w-full no-scrollbar">
                            {tabs.map((tab) => (
                                <NavLink
                                    key={tab.path}
                                    to={tab.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-2.5 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 whitespace-nowrap
                                        ${isActive
                                            ? 'bg-white text-indigo-600 shadow-sm border border-white translate-y-[-2px]'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}
                                    `}
                                >
                                    <tab.icon className={`w-4 h-4 transition-colors ${location.pathname.includes(tab.path) ? 'text-indigo-600' : 'text-gray-300'}`} />
                                    {tab.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Integrated Perspective Content */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm min-h-[600px] w-full overflow-hidden">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* Modal Orchestration */}
            {isManageModalOpen && (
                <ManageCaseModal
                    isOpen={isManageModalOpen}
                    onClose={() => setIsManageModalOpen(false)}
                />
            )}
        </div>
    )
}
