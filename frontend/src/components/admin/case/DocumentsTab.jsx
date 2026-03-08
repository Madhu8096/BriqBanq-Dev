// src/components/admin/case/DocumentsTab.jsx
import { FileText, Download, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function DocumentsTab() {
    const [isGenerating, setIsGenerating] = useState({ im: false, flyer: false })

    const simulateGeneration = (type) => {
        setIsGenerating(prev => ({ ...prev, [type]: true }))
        setTimeout(() => {
            setIsGenerating(prev => ({ ...prev, [type]: false }))
            alert(`${type === 'im' ? 'Investment Memorandum' : 'Marketing Flyer'} has been generated and is ready for download.`)
        }, 2000)
    }

    return (
        <div className="space-y-10">
            {/* Header Banner */}
            <div className="p-6 bg-blue-900 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FileText className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-black mb-1 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-300" />
                        Document Generator
                    </h3>
                    <p className="text-sm text-blue-100 font-medium">Auto-generate professional PDFs using the latest case data</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Document Card 1 */}
                <div className="p-8 rounded-[2.5rem] bg-white border-2 border-gray-50 flex flex-col items-center text-center space-y-6 hover:shadow-2xl hover:border-indigo-100/50 transition-all group">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
                        <FileText className="w-10 h-10" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">Investment Memorandum</h4>
                        <p className="text-sm text-gray-400 font-medium mt-1">Full professional prospectus for institutional investors</p>
                    </div>
                    <button
                        onClick={() => simulateGeneration('im')}
                        disabled={isGenerating.im}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                    >
                        {isGenerating.im ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isGenerating.im ? 'Generating IM...' : 'Generate New IM'}
                    </button>
                </div>

                {/* Document Card 2 */}
                <div className="p-8 rounded-[2.5rem] bg-white border-2 border-gray-50 flex flex-col items-center text-center space-y-6 hover:shadow-2xl hover:border-blue-100/50 transition-all group">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                        <FileText className="w-10 h-10" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">Marketing Flyer</h4>
                        <p className="text-sm text-gray-400 font-medium mt-1">One-page executive summary for retail platforms</p>
                    </div>
                    <button
                        onClick={() => simulateGeneration('flyer')}
                        disabled={isGenerating.flyer}
                        className="w-full py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:border-blue-200 transition-all flex items-center justify-center gap-2"
                    >
                        {isGenerating.flyer ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Download className="w-4 h-4 text-gray-400" />}
                        {isGenerating.flyer ? 'Generating Flyer...' : 'Generate New Flyer'}
                    </button>
                </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-black text-amber-900 uppercase tracking-widest mb-1">Important Note</p>
                    <p className="text-xs text-amber-700/80 font-medium leading-relaxed">
                        Document generation pulls the latest data including valuations, bids, and AI marketing content.
                        Please ensure you've saved all changes in previous tabs before generating new documents.
                    </p>
                </div>
            </div>
        </div>
    )
}
