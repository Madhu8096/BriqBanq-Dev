// src/components/admin/case/ManageCaseModal.jsx
import { useState } from 'react'
import { X, FileText, Image as ImageIcon, Sparkles, Download, ShieldCheck } from 'lucide-react'
import { useCaseContext } from '../../../context/CaseContext'
import CaseDetailsTab from './CaseDetailsTab'
import PropertyImagesTab from './PropertyImagesTab'
import AIContentTab from './AIContentTab'
import DocumentsTab from './DocumentsTab'

export default function ManageCaseModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('case-details')
    const { caseData } = useCaseContext()

    if (!isOpen) return null

    const tabs = [
        { label: 'Case Details', icon: FileText, id: 'case-details' },
        { label: 'Property Images', icon: ImageIcon, id: 'property-images' },
        { label: 'AI Content', icon: Sparkles, id: 'ai-content' },
        { label: 'Documents', icon: Download, id: 'documents' },
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            case 'case-details': return <CaseDetailsTab />
            case 'property-images': return <PropertyImagesTab />
            case 'ai-content': return <AIContentTab />
            case 'documents': return <DocumentsTab />
            default: return <CaseDetailsTab />
        }
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 md:p-12">
            {/* Backdrop with strong blur */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-all duration-500"
                onClick={onClose}
            />

            {/* Modal Content - Extreme Premium Aesthetic */}
            <div className="relative bg-white w-full max-w-[1400px] h-[90vh] rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 ease-out border border-white/50">

                {/* Header Section */}
                <div className="px-16 py-10 flex items-start justify-between bg-white relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-100">
                                Administrative Command
                            </div>
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                <ShieldCheck className="w-3 h-3" />
                                Secured Session
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                            {caseData?.id || 'MIP-2026-001'} Management
                        </h2>
                        <p className="text-sm text-gray-400 font-medium max-w-xl">
                            Orchestrate case lifecycles, curate media assets, and leverage proprietary AI to optimize investment memorandums.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-4 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-xl hover:scale-110 active:scale-95 rounded-2xl transition-all duration-300 border border-gray-100 group"
                    >
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Navigation Strategy */}
                <div className="px-16 pt-2 pb-8 bg-white border-b border-gray-50">
                    <div className="flex gap-4 p-1.5 bg-gray-100/50 rounded-[1.5rem] w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-3 px-8 py-3.5 text-[11px] font-black uppercase tracking-widest rounded-[1.25rem] transition-all duration-500
                                    ${activeTab === tab.id
                                        ? 'bg-white text-indigo-600 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] scale-[1.02]'
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-white/40'}
                                `}
                            >
                                <tab.icon className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-300'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Deep Content Area */}
                <div className="flex-1 overflow-y-auto p-16 bg-gray-50/30">
                    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-700">
                        {renderTabContent()}
                    </div>
                </div>

                {/* High-Action Footer */}
                <div className="px-16 py-10 bg-white border-t border-gray-50 flex justify-between items-center relative z-10 shadow-[0_-8px_32px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Auto-Saving Enabled • Draft Securely Stored</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onClose}
                            className="px-10 py-3.5 bg-white border border-gray-200 rounded-[1.25rem] text-[11px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                        >
                            Discard Session
                        </button>
                        <button
                            className="group relative px-12 py-3.5 bg-gray-900 text-white rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all duration-500 shadow-xl shadow-gray-200 hover:shadow-indigo-100 hover:scale-[1.02] active:scale-95 overflow-hidden"
                            onClick={onClose}
                        >
                            <span className="relative z-10">Commit Operations</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
