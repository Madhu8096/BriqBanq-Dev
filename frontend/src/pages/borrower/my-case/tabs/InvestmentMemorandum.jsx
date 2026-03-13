import { useState, useEffect } from 'react'
import { borrowerApi } from '../../api'
import { MOCK_INVESTMENT_MEMO } from '../../data/investmentMemoMockData'
import HeaderControls from './investment-memorandum/HeaderControls'
import HeroSection from './investment-memorandum/HeroSection'
import ExecutiveSummary from './investment-memorandum/ExecutiveSummary'
import InvestmentHighlights from './investment-memorandum/InvestmentHighlights'
import PropertyGallery from './investment-memorandum/PropertyGallery'
import LoanDetails from './investment-memorandum/LoanDetails'
import PropertyDetails from './investment-memorandum/PropertyDetails'
import RiskAssessment from './investment-memorandum/RiskAssessment'
import InvestmentTerms from './investment-memorandum/InvestmentTerms'
import ContactInformation from './investment-memorandum/ContactInformation'
import ImportantDisclaimer from './investment-memorandum/ImportantDisclaimer'

const normalizeMemo = (raw) => {
  if (!raw || typeof raw !== 'object') return null
  const d = raw?.data !== undefined ? raw.data : raw
  return d && typeof d === 'object' ? d : null
}

export default function InvestmentMemorandum({ caseId }) {
  const [memoData, setMemoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* eslint-disable react-hooks/set-state-in-effect -- reset loading/error at start of fetch */
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    if (!caseId) {
      setMemoData(MOCK_INVESTMENT_MEMO)
      setLoading(false)
      return () => {}
    }

    borrowerApi
      .getInvestmentMemo(caseId)
      .then((res) => {
        if (cancelled) return
        const data = normalizeMemo(res)
        if (data) setMemoData(data)
        else setMemoData(MOCK_INVESTMENT_MEMO)
      })
      .catch((err) => {
        if (cancelled) return
        const isOffline = err?.code === 'ERR_NETWORK' || err?.isOffline
        setMemoData(MOCK_INVESTMENT_MEMO)
        if (!isOffline) setError(err?.message || 'Failed to load memorandum')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [caseId])
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleDownloadPDF = () => {
    if (caseId) {
      borrowerApi
        .generateInvestmentMemoPdf(caseId)
        .then((res) => {
          if (res?.data instanceof Blob && res.data.size > 0) {
            const url = window.URL.createObjectURL(res.data)
            const a = document.createElement('a')
            a.href = url
            a.download = `Investment_Memo_${caseId}.pdf`
            a.click()
            window.URL.revokeObjectURL(url)
          } else throw new Error('No file')
        })
        .catch(() => {
          window.print()
        })
    } else {
      window.print()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEdit = () => {
    // Backend: navigate to edit or open edit modal
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" id="investment-memo-content">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!memoData) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center" id="investment-memo-content">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📄</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Investment Memorandum Available</h3>
        <p className="text-sm text-slate-600">The investment memorandum for this case is not yet available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-0" id="investment-memo-content">
      {error && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 no-print">
          {error}
        </div>
      )}
      <HeaderControls onEdit={handleEdit} onPrint={handlePrint} onDownload={handleDownloadPDF} />

      <HeroSection
        urgencyBadge={memoData.urgencyBadge}
        address={memoData.property?.address}
        location={memoData.property?.fullAddress}
        heroImage={memoData.images?.hero}
        thumbnails={memoData.images?.thumbnails}
        propertyValue={memoData.financials?.propertyValue}
        outstandingDebt={memoData.financials?.outstandingDebt}
        expectedReturn={memoData.financials?.expectedReturn}
      />

      <ExecutiveSummary
        text={memoData.executiveSummary?.text}
        highlights={memoData.executiveSummary?.highlights}
      />

      <InvestmentHighlights highlights={memoData.investmentHighlights} />

      <PropertyGallery images={memoData.images?.gallery} />

      <LoanDetails financials={memoData.financials} defaultStatus={memoData.defaultStatus} />

      <PropertyDetails property={memoData.property} valuation={memoData.valuation} />

      <RiskAssessment risks={memoData.riskAssessment} />

      <InvestmentTerms terms={memoData.investmentTerms} />

      <ContactInformation contact={{ ...memoData.contact, caseNumber: memoData.caseId || caseId }} />

      <ImportantDisclaimer />
    </div>
  )
}
