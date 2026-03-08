// src/components/admin/case/AIContentTab.jsx
import { useState } from 'react'
import { Sparkles, Loader2, Save } from 'lucide-react'

export default function AIContentTab() {
    const [loadingStates, setLoadingStates] = useState({
        marketing: false,
        highlights: false,
        location: false
    })

    const [content, setContent] = useState({
        marketing: '',
        highlights: '',
        location: ''
    })

    const generateAI = (type) => {
        setLoadingStates(prev => ({ ...prev, [type]: true }))

        // Mock simulation
        setTimeout(() => {
            let result = ''
            if (type === 'marketing') result = 'Step into luxury with this stunning penthouse offering breathtaking panoramic views of Sydney Harbour. Featuring impeccably designed open-plan living, private balconies, and proximity to first-class amenities.'
            if (type === 'highlights') result = '• 15% immediate equity buffer\n• Projected 7.2% annual yield\n• Prime metropolitan location\n• Long-term stable tenant potential'
            if (type === 'location') result = 'Potts Point remains one of Sydney\'s most resilient real estate markets, benefiting from limited new supply and sustained demand from high-net-worth professionals.'

            setContent(prev => ({ ...prev, [type]: result }))
            setLoadingStates(prev => ({ ...prev, [type]: false }))
        }, 1500)
    }

    return (
        <div className="space-y-10">
            {/* Header Banner */}
            <div className="p-6 bg-indigo-900 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-black mb-1 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-300" />
                        AI Content Generator
                    </h3>
                    <p className="text-sm text-indigo-100 font-medium">Generate professional marketing copy and investor insights in seconds</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section 1: Marketing Description */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marketing Description</h4>
                        <button
                            onClick={() => generateAI('marketing')}
                            disabled={loadingStates.marketing}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {loadingStates.marketing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            AI Generate
                        </button>
                    </div>
                    <textarea
                        rows={4}
                        value={content.marketing}
                        onChange={(e) => setContent({ ...content, marketing: e.target.value })}
                        placeholder="Focus on the property's unique selling points..."
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[2rem] px-6 py-5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all shadow-sm min-h-[160px] resize-none"
                    />
                </div>

                {/* Section 2: Investment Highlights */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Investment Highlights</h4>
                        <button
                            onClick={() => generateAI('highlights')}
                            disabled={loadingStates.highlights}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {loadingStates.highlights ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            AI Generate
                        </button>
                    </div>
                    <textarea
                        rows={4}
                        value={content.highlights}
                        onChange={(e) => setContent({ ...content, highlights: e.target.value })}
                        placeholder="Bullet points for investors..."
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[2rem] px-6 py-5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all shadow-sm min-h-[160px] resize-none"
                    />
                </div>

                {/* Section 3: Location & Market Notes */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location & Market Notes</h4>
                        <button
                            onClick={() => generateAI('location')}
                            disabled={loadingStates.location}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {loadingStates.location ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            AI Generate
                        </button>
                    </div>
                    <textarea
                        rows={4}
                        value={content.location}
                        onChange={(e) => setContent({ ...content, location: e.target.value })}
                        placeholder="Market data and suburb stats..."
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[2rem] px-6 py-5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all shadow-sm min-h-[160px] resize-none"
                    />
                </div>
            </div>
        </div>
    )
}
