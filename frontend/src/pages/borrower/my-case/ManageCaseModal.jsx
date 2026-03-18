import { useState, useEffect } from 'react'
import DatePicker from '../../../components/common/DatePicker'

const TABS = [
  { id: 'case-details', label: 'Case Details', icon: '📋' },
  { id: 'property-images', label: 'Property Images', icon: '🖼️' },
  { id: 'ai-content', label: 'AI Content', icon: '✨' },
  { id: 'documents', label: 'Documents', icon: '📥' },
]

/** Parse location "Potts Point, NSW 2011" into suburb and postcode */
function parseLocation(location) {
  if (!location || typeof location !== 'string') return { suburb: '', postcode: '' }
  const parts = location.split(',').map((p) => p.trim())
  const last = parts[parts.length - 1] || ''
  const postcodeMatch = last.match(/(\d+)/)
  const postcode = postcodeMatch ? postcodeMatch[1] : ''
  const suburb = parts.length > 1 ? parts[0] : ''
  return { suburb, postcode }
}

/** Format date for input[type="text"] display e.g. 15 Jan 2026 -> 01/15/2026 */
function toDateInputValue(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return String(dateStr)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const y = d.getFullYear()
  return `${m}/${day}/${y}`
}

export default function ManageCaseModal({ caseData, isOpen, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('case-details')
  const [caseDetails, setCaseDetails] = useState({})
  const [propertyImages, setPropertyImages] = useState([])
  const [aiContent, setAiContent] = useState({
    marketingDescription: '',
    investmentHighlights: '',
    locationMarketNotes: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [aiSuggestLoading, setAiSuggestLoading] = useState(false)
  const [aiSuggestMessage, setAiSuggestMessage] = useState(null)
  const [aiGenerateLoading, setAiGenerateLoading] = useState(null) // 'marketingDescription' | 'investmentHighlights' | 'locationMarketNotes'
  const [generateImLoading, setGenerateImLoading] = useState(false)
  const [generateFlyerLoading, setGenerateFlyerLoading] = useState(false)

  const caseId = caseData?.id || ''
  const { suburb, postcode } = parseLocation(caseData?.property?.location)

  useEffect(() => {
    if (!isOpen || !caseData) return
    setSaveError(null)
    setCaseDetails({
      caseNumber: caseData.id || '',
      borrowerName: caseData.borrower || '',
      lenderName: caseData.lender || '',
      outstandingDebt: String(caseData.outstandingDebt ?? ''),
      interestRate: '5.75',
      defaultRate: '8.25',
      daysInDefault: '0',
      address: caseData.property?.address || '',
      suburb: suburb || '',
      postcode: postcode || '',
      bedrooms: String(caseData.property?.bedrooms ?? ''),
      bathrooms: String(caseData.property?.bathrooms ?? ''),
      valuationAmount: String(caseData.valuation?.amount ?? caseData.propertyValuation ?? ''),
      valuationDate: toDateInputValue(caseData.valuation?.date),
      valuerName: caseData.valuation?.valuer || '',
    })
    setAiContent({
      marketingDescription: '',
      investmentHighlights: '',
      locationMarketNotes: '',
    })
    setPropertyImages([])
    setAiSuggestMessage(null)
    setActiveTab('case-details')
  // eslint-disable-next-line react-hooks/exhaustive-deps -- sync form when modal opens or case id changes; full caseData intentionally not in deps to avoid overwriting user edits
  }, [isOpen, caseData?.id, caseData?.borrower, caseData?.lender, caseData?.outstandingDebt, caseData?.property?.address, caseData?.property?.bedrooms, caseData?.property?.bathrooms, caseData?.valuation?.amount, caseData?.valuation?.date, caseData?.valuation?.valuer, suburb, postcode])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const handleClose = () => {
    onClose?.()
  }

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) handleClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') handleClose()
  }

  const handleSave = async () => {
    setSaveError(null)
    setIsSaving(true)
    try {
      await onSave?.({
        caseDetails,
        propertyImages,
        aiContent,
      })
      handleClose()
    } catch (err) {
      console.error('Save failed', err)
      setSaveError(err?.message || 'Save failed. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const updateCaseDetail = (field, value) => {
    setCaseDetails((prev) => ({ ...prev, [field]: value }))
  }

  const updateAiContent = (field, value) => {
    setAiContent((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    setPropertyImages((prev) => [...prev, ...files])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer?.files || [])
    setPropertyImages((prev) => [...prev, ...files])
  }

  const handleDragOver = (e) => e.preventDefault()

  const handleAiSuggestImages = async () => {
    setAiSuggestLoading(true)
    setAiSuggestMessage(null)
    try {
      await new Promise((r) => setTimeout(r, 1200))
      setAiSuggestMessage('AI suggested 3 property images. Add them via Upload Images or drag-and-drop.')
    } finally {
      setAiSuggestLoading(false)
    }
  }

  const handleAiGenerate = async (field) => {
    setAiGenerateLoading(field)
    try {
      await new Promise((r) => setTimeout(r, 800))
      const placeholders = {
        marketingDescription: `Professional marketing description for ${caseData?.property?.address || 'this property'}. Prime location, strong investment potential.`,
        investmentHighlights: 'Key selling points: strong rental demand, quality finishes, transport links, growth suburb.',
        locationMarketNotes: `${caseData?.property?.location || 'Suburb'} – local amenities, schools, and market trends.`,
      }
      setAiContent((prev) => ({ ...prev, [field]: placeholders[field] || prev[field] }))
    } finally {
      setAiGenerateLoading(null)
    }
  }

  const handleGenerateIM = async () => {
    setGenerateImLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      const text = `Investment Memorandum – ${caseId}\n\nBorrower: ${caseDetails.borrowerName}\nLender: ${caseDetails.lenderName}\nProperty: ${caseDetails.address}, ${caseDetails.suburb} ${caseDetails.postcode}\nValuation: $${Number(caseDetails.valuationAmount || 0).toLocaleString()}\n\nGenerated from Brickbanq.`
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Investment-Memorandum-${caseId}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerateImLoading(false)
    }
  }

  const handleGenerateFlyer = async () => {
    setGenerateFlyerLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      const text = `Marketing Flyer – ${caseId}\n${caseDetails.address}, ${caseDetails.suburb}\nSingle-page summary. Generated from Brickbanq.`
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Marketing-Flyer-${caseId}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setGenerateFlyerLoading(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleBackdrop}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={handleBackdrop}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-case-title"
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col my-auto min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200 flex-shrink-0">
            <div className="min-w-0 flex-1">
              <h2 id="manage-case-title" className="text-xl font-bold text-slate-900">
                Manage Case: {caseId}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Update details, upload images, and generate AI content.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs - equal width, aligned with content */}
          <div className="flex border-b border-slate-200 flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors min-w-0 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-b-2 border-transparent'
                }`}
              >
                <span className="text-base flex-shrink-0" aria-hidden>{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content - consistent padding and section structure */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {activeTab === 'case-details' && (
              <div className="space-y-8 max-w-full">
                <section>
                  <h3 className="text-base font-bold text-slate-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Case Number</label>
                      <input
                        type="text"
                        value={caseDetails.caseNumber}
                        onChange={(e) => updateCaseDetail('caseNumber', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Borrower Name</label>
                      <input
                        type="text"
                        value={caseDetails.borrowerName}
                        onChange={(e) => updateCaseDetail('borrowerName', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Lender Name</label>
                      <input
                        type="text"
                        value={caseDetails.lenderName}
                        onChange={(e) => updateCaseDetail('lenderName', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </section>
                <section className="pt-0">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Loan Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <span className="inline-flex items-center gap-1">
                          Outstanding Debt
                          <span className="inline-flex w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-xs items-center justify-center cursor-help" title="Outstanding loan balance">i</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={caseDetails.outstandingDebt}
                        onChange={(e) => updateCaseDetail('outstandingDebt', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Interest Rate (%)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={caseDetails.interestRate}
                        onChange={(e) => updateCaseDetail('interestRate', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Rate (%)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={caseDetails.defaultRate}
                        onChange={(e) => updateCaseDetail('defaultRate', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Days in Default</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={caseDetails.daysInDefault}
                        onChange={(e) => updateCaseDetail('daysInDefault', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </section>
                <section className="pt-0">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Property Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                      <input
                        type="text"
                        value={caseDetails.address}
                        onChange={(e) => updateCaseDetail('address', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Suburb</label>
                      <input
                        type="text"
                        value={caseDetails.suburb}
                        onChange={(e) => updateCaseDetail('suburb', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Postcode</label>
                      <input
                        type="text"
                        value={caseDetails.postcode}
                        onChange={(e) => updateCaseDetail('postcode', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Bedrooms</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={caseDetails.bedrooms}
                        onChange={(e) => updateCaseDetail('bedrooms', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Bathrooms</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={caseDetails.bathrooms}
                        onChange={(e) => updateCaseDetail('bathrooms', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </section>
                <section className="pt-0">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Valuation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Valuation Amount</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={caseDetails.valuationAmount}
                        onChange={(e) => updateCaseDetail('valuationAmount', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Valuation Date</label>
                      <DatePicker
                        value={caseDetails.valuationDate}
                        onChange={(dateStr) => updateCaseDetail('valuationDate', dateStr)}
                        placeholder="MM/DD/YYYY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Valuer Name</label>
                      <input
                        type="text"
                        value={caseDetails.valuerName}
                        onChange={(e) => updateCaseDetail('valuerName', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'property-images' && (
              <div className="space-y-6 max-w-full">
                <section>
                  <h3 className="text-base font-bold text-slate-900 mb-4">Property Images</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleAiSuggestImages}
                      disabled={aiSuggestLoading}
                      className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
                    >
                      <span>✨</span>
                      {aiSuggestLoading ? 'Suggesting…' : 'AI Suggest Images'}
                    </button>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 cursor-pointer">
                      <span>↑</span>
                      Upload Images
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                  <div
                    className="mt-4 border-2 border-dashed border-slate-300 rounded-lg p-12 text-center bg-slate-50/50 min-h-[200px] flex flex-col items-center justify-center"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <div className="w-16 h-16 mb-3 text-slate-400 flex items-center justify-center text-4xl">🖼️</div>
                    {propertyImages.length === 0 && !aiSuggestMessage ? (
                      <>
                        <p className="text-sm text-slate-500 mb-1">No images uploaded yet</p>
                        <p className="text-xs text-slate-400 mb-3">Upload property images or use AI to suggest relevant images</p>
                        <label className="inline-block text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">
                          Click to upload
                          <input type="file" accept="image/*" multiple className="sr-only" onChange={handleFileSelect} />
                        </label>
                      </>
                    ) : aiSuggestMessage ? (
                      <p className="text-sm text-slate-700 mb-3">{aiSuggestMessage}</p>
                    ) : null}
                    {propertyImages.length > 0 && <p className="text-sm text-slate-700">{propertyImages.length} image(s) selected</p>}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'ai-content' && (
              <div className="space-y-6 max-w-full">
                <section>
                  <div className="bg-indigo-50/80 border border-indigo-100 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-indigo-600 text-lg">✨</span>
                      <h3 className="text-base font-bold text-slate-900">AI Content Generator</h3>
                    </div>
                    <p className="text-sm text-slate-600">Generate professional marketing content and investment highlights</p>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Marketing Description</label>
                      <div className="flex gap-3 items-start">
                        <textarea
                          value={aiContent.marketingDescription}
                          onChange={(e) => updateAiContent('marketingDescription', e.target.value)}
                          placeholder="Professional marketing description..."
                          rows={4}
                          className="flex-1 min-w-0 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[88px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAiGenerate('marketingDescription')}
                          disabled={aiGenerateLoading !== null}
                          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        >
                          <span>✨</span>
                          {aiGenerateLoading === 'marketingDescription' ? 'Generating…' : 'AI Generate'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Investment Highlights</label>
                      <div className="flex gap-3 items-start">
                        <textarea
                          value={aiContent.investmentHighlights}
                          onChange={(e) => updateAiContent('investmentHighlights', e.target.value)}
                          placeholder="Key selling points..."
                          rows={4}
                          className="flex-1 min-w-0 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[88px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAiGenerate('investmentHighlights')}
                          disabled={aiGenerateLoading !== null}
                          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        >
                          <span>✨</span>
                          {aiGenerateLoading === 'investmentHighlights' ? 'Generating…' : 'AI Generate'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Location & Market Notes</label>
                      <div className="flex gap-3 items-start">
                        <textarea
                          value={aiContent.locationMarketNotes}
                          onChange={(e) => updateAiContent('locationMarketNotes', e.target.value)}
                          placeholder="Suburb information..."
                          rows={4}
                          className="flex-1 min-w-0 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[88px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAiGenerate('locationMarketNotes')}
                          disabled={aiGenerateLoading !== null}
                          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        >
                          <span>✨</span>
                          {aiGenerateLoading === 'locationMarketNotes' ? 'Generating…' : 'AI Generate'}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6 max-w-full">
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-slate-600 text-lg">📄</span>
                    <h3 className="text-base font-bold text-slate-900">Document Generator</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-6">Generate professional documents using case data</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col min-h-[180px]">
                      <span className="text-2xl mb-2">📄</span>
                      <h4 className="text-base font-semibold text-slate-900 mb-1">Investment Memorandum</h4>
                      <p className="text-sm text-slate-500 mb-4">Full professional IM</p>
                      <button
                        type="button"
                        onClick={handleGenerateIM}
                        disabled={generateImLoading}
                        className="mt-auto inline-flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {generateImLoading ? 'Generating…' : 'Generate IM'}
                      </button>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col min-h-[180px]">
                      <span className="text-2xl mb-2">📄</span>
                      <h4 className="text-base font-semibold text-slate-900 mb-1">Marketing Flyer</h4>
                      <p className="text-sm text-slate-500 mb-4">Single-page summary</p>
                      <button
                        type="button"
                        onClick={handleGenerateFlyer}
                        disabled={generateFlyerLoading}
                        className="mt-auto inline-flex items-center justify-center gap-2 w-full py-2.5 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {generateFlyerLoading ? 'Generating…' : 'Generate Flyer'}
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 p-6 border-t border-slate-200 flex-shrink-0 bg-slate-50/50">
            {saveError && (
              <p className="text-sm text-red-600" role="alert">
                {saveError}
              </p>
            )}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
