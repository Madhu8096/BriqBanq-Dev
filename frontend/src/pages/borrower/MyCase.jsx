import { useState, useMemo, useEffect } from 'react'
import Breadcrumb from './components/Breadcrumb'
import CaseHeader from './my-case/CaseHeader'
import ManageCaseModal from './my-case/ManageCaseModal'
import DashboardTab from './my-case/tabs/DashboardTab'
import FullDetailsTab from './my-case/tabs/FullDetailsTab'
import LawyerReviewTab from './my-case/tabs/LawyerReviewTab'
import PropertyTab from './my-case/tabs/PropertyTab'
import DocumentsTab from './my-case/tabs/DocumentsTab'
import InvestmentMemoTab from './my-case/tabs/InvestmentMemoTab'
import SettlementTab from './my-case/tabs/SettlementTab'
import BidsTab from './my-case/tabs/BidsTab'
import MessagesTab from './my-case/tabs/MessagesTab'
import { caseService } from '../../api/dataService'
import { borrowerApi } from './api'
import {
  MOCK_BORROWER_CASE,
  MOCK_MY_CASE_MESSAGES,
  MOCK_MY_CASE_UPLOADED_DOCS,
  MOCK_SETTLEMENT_TASK_SUMMARY,
  MOCK_SETTLEMENT_GROUPS,
} from './data/borrowerMockData'

const TAB_ICONS = {
  dashboard: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  ),
  'full-details': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ),
  'lawyer-review': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
  ),
  property: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  ),
  documents: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
  ),
  'investment-memorandum': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  settlement: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  ),
  bids: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  messages: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
  ),
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'full-details', label: 'Full Details' },
  { id: 'lawyer-review', label: 'Lawyer Review' },
  { id: 'property', label: 'Property' },
  { id: 'documents', label: 'Documents' },
  { id: 'investment-memorandum', label: 'Investment Memorandum' },
  { id: 'settlement', label: 'Settlement' },
  { id: 'bids', label: 'Bids' },
  { id: 'messages', label: 'Messages' },
]

export default function MyCase() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showBorrowerStatusModal, setShowBorrowerStatusModal] = useState(false)
  const [showManageCaseModal, setShowManageCaseModal] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState(MOCK_MY_CASE_UPLOADED_DOCS)
  const [caseData, setCaseData] = useState(MOCK_BORROWER_CASE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCase = async () => {
      setLoading(true)
      try {
        const res = await caseService.getMyCases()
        if (res.success && res.data && res.data.length > 0) {
          // Flatten property data for display
          const rawCase = res.data[0]
          setCaseData({
            ...MOCK_BORROWER_CASE,
            id: rawCase.id,
            status: rawCase.status,
            borrower: rawCase.borrower_name || MOCK_BORROWER_CASE.borrower,
            lender: rawCase.lender_name || MOCK_BORROWER_CASE.lender,
            lawyer: rawCase.lawyer_name,
            riskLevel: rawCase.risk_level,
            property: {
              ...MOCK_BORROWER_CASE.property,
              address: rawCase.property_address || MOCK_BORROWER_CASE.property.address,
              type: rawCase.property_type || MOCK_BORROWER_CASE.property.type,
              valuation: rawCase.estimated_value || MOCK_BORROWER_CASE.property.valuation,
            },
            financials: {
              ...MOCK_BORROWER_CASE.financials,
              outstandingPrincipal: rawCase.outstanding_debt || MOCK_BORROWER_CASE.financials.outstandingPrincipal,
            }
          })
        }
      } catch (err) {
        console.error("Failed to fetch case:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCase()
  }, [])

  const c = caseData
  const addr = c.property
    ? `${c.property.address}, ${c.property.suburb}, ${c.property.state} ${c.property.postcode || ''}`.trim()
    : '45 Victoria Street, Potts Point, NSW 2011'

  const propertyForHeader = useMemo(
    () =>
      c.property
        ? {
            address: c.property.address,
            suburb: c.property.suburb,
            state: c.property.state,
            postcode: c.property.postcode,
            location: [c.property.suburb, c.property.state, c.property.postcode].filter(Boolean).join(', '),
          }
        : null,
    [c.property]
  )

  const manageCaseData = useMemo(
    () => ({
      id: c.id,
      borrower: typeof c.borrower === 'object' ? c.borrower?.name : c.borrower,
      lender: typeof c.lender === 'object' ? c.lender?.name : c.lender,
      outstandingDebt: c.lender?.outstandingDebt ?? c.financials?.outstandingPrincipal ?? 980000,
      property: {
        address: c.property?.address ?? '',
        location: [c.property?.suburb, c.property?.state, c.property?.postcode].filter(Boolean).join(', '),
        suburb: c.property?.suburb ?? '',
        postcode: c.property?.postcode ?? '',
        bedrooms: c.property?.bedrooms ?? 2,
        bathrooms: c.property?.bathrooms ?? 2,
        valuation: c.property?.valuation ?? 1250000,
      },
      propertyValuation: c.property?.valuation ?? 1250000,
      valuation: {
        amount: c.property?.valuation ?? 1250000,
        date: c.property?.valuationDate ?? '15 Jan 2026',
        valuer: c.property?.valuer ?? 'Preston Rowe Paterson',
      },
    }),
    [c.id, c.borrower, c.lender, c.property, c.financials]
  )

  const handleExportReport = async () => {
    try {
      const res = await caseService.exportCaseReport(c.id)
      if (res.success) {
        const report = res.data
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Case-Report-${c.id}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        alert("Export failed: " + (res.error || "Unknown error"))
      }
    } catch (err) {
      console.error("Export error:", err)
      alert("Failed to export report.")
    }
  }

  const handleManageCase = () => setShowManageCaseModal(true)
  const handleBorrowerStatus = () => setShowBorrowerStatusModal(true)
  const applyCaseDetailsToState = (payload) => {
    const d = payload?.caseDetails || {}
    setCaseData((prev) => {
      const next = { ...prev }
      if (d.caseNumber) next.id = d.caseNumber
      if (d.borrowerName != null) {
        next.borrower = typeof prev.borrower === 'object' && prev.borrower
          ? { ...prev.borrower, name: d.borrowerName }
          : d.borrowerName
      }
      if (d.lenderName != null) {
        next.lender = typeof prev.lender === 'object' && prev.lender
          ? { ...prev.lender, name: d.lenderName }
          : d.lenderName
      }
      const outDebt = d.outstandingDebt !== undefined && d.outstandingDebt !== '' ? Number(d.outstandingDebt) : undefined
      if (outDebt !== undefined && !Number.isNaN(outDebt)) {
        next.lender = typeof next.lender === 'object' && next.lender ? { ...next.lender, outstandingDebt: outDebt } : { name: next.lender, outstandingDebt: outDebt }
        if (next.financials) next.financials = { ...next.financials, outstandingPrincipal: outDebt }
      }
      if (d.address != null || d.suburb != null || d.postcode != null || d.bedrooms != null || d.bathrooms != null || d.valuationAmount != null || d.valuationDate != null || d.valuerName != null) {
        next.property = { ...(prev.property || {}) }
        if (d.address !== undefined) next.property.address = d.address
        if (d.suburb !== undefined) next.property.suburb = d.suburb
        if (d.postcode !== undefined) next.property.postcode = d.postcode
        if (d.bedrooms !== undefined && d.bedrooms !== '') next.property.bedrooms = Number(d.bedrooms) || prev.property?.bedrooms
        if (d.bathrooms !== undefined && d.bathrooms !== '') next.property.bathrooms = Number(d.bathrooms) || prev.property?.bathrooms
        if (d.valuationAmount !== undefined && d.valuationAmount !== '') next.property.valuation = Number(d.valuationAmount) || prev.property?.valuation
        if (d.valuationDate !== undefined) next.property.valuationDate = d.valuationDate
        if (d.valuerName !== undefined) next.property.valuer = d.valuerName
        if (next.property.suburb || next.property.state || next.property.postcode) {
          next.property.location = [next.property.suburb, next.property.state, next.property.postcode].filter(Boolean).join(', ')
        }
      }
      return next
    })
  }

  const handleManageCaseSave = async (payload) => {
    try {
      await borrowerApi.updateCase(c.id, {
        caseDetails: payload.caseDetails,
        aiContent: payload.aiContent,
      })
      applyCaseDetailsToState(payload)
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Save failed. Please try again.'
      throw new Error(message)
    }
  }

  const settlementData = useMemo(
    () => ({
      ...MOCK_SETTLEMENT_TASK_SUMMARY,
      checklist: [],
      messages: [],
      readiness: 33,
      outstandingItems: [],
    }),
    []
  )

  const propertyTabData = useMemo(
    () =>
      c.property
        ? {
            address: c.property.address,
            location: [c.property.suburb, c.property.state, c.property.postcode].filter(Boolean).join(', '),
            type: c.property.type,
            bedrooms: c.property.bedrooms,
            bathrooms: c.property.bathrooms,
            parking: c.property.parking,
          }
        : null,
    [c.property]
  )

  const valuationTabData = useMemo(
    () =>
      c.property
        ? {
            amount: c.property.valuation,
            date: c.property.valuationDate,
            valuer: c.property.valuer,
          }
        : null,
    [c.property]
  )

  const bidsData = useMemo(() => c.bidHistory || [], [c.bidHistory])

  return (
    <div className="p-6 md:p-8 space-y-6">
      {loading && (
        <div className="fixed inset-0 z-[60] bg-white/80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                <span className="text-sm font-medium text-slate-600">Loading case details…</span>
            </div>
        </div>
      )}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">My Case</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your mortgage resolution case.</p>
      </div>

      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/borrower/dashboard', icon: 'home' },
          { label: 'Cases', path: '/borrower/dashboard' },
          { label: c.id },
        ]}
      />

      <CaseHeader
        caseId={c.id}
        status={c.status}
        riskLevel={c.riskLevel ? `${c.riskLevel} Risk` : 'Medium Risk'}
        property={propertyForHeader}
        borrower={typeof c.borrower === 'object' ? c.borrower?.name : c.borrower}
        lender={typeof c.lender === 'object' ? c.lender?.name : c.lender}
        outstandingDebt={c.financials?.outstandingPrincipal ?? 980000}
        propertyValuation={c.property?.valuation ?? 1250000}
        onExportReport={handleExportReport}
        onManageCase={handleManageCase}
      />

      <div className="border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto pb-px" aria-label="Case tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {TAB_ICONS[tab.id]}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'dashboard' && <DashboardTab caseData={c} onBorrowerStatusClick={handleBorrowerStatus} />}
        {activeTab === 'full-details' && <FullDetailsTab caseData={c} />}
        {activeTab === 'lawyer-review' && <LawyerReviewTab caseId={c.id} />}
        {activeTab === 'property' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <PropertyTab data={propertyTabData} valuation={valuationTabData} />
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <DocumentsTab
              caseId={c.id}
              documents={uploadedDocs}
              onDocumentUploaded={() => setUploadedDocs((prev) => [...prev])}
            />
          </div>
        )}
        {activeTab === 'investment-memorandum' && (
          <InvestmentMemoTab caseId={c.id} />
        )}
        {activeTab === 'settlement' && (
          <SettlementTab
            settlement={settlementData}
            property={c.property ? { address: addr, location: c.property.suburb } : null}
            caseId={c.id}
          />
        )}
        {activeTab === 'bids' && <BidsTab bids={bidsData} />}
        {activeTab === 'messages' && (
          <MessagesTab caseId={c.id} messages={MOCK_MY_CASE_MESSAGES} />
        )}
      </div>

      <ManageCaseModal
        caseData={manageCaseData}
        isOpen={showManageCaseModal}
        onClose={() => setShowManageCaseModal(false)}
        onSave={handleManageCaseSave}
      />

      {showBorrowerStatusModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="borrower-status-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 id="borrower-status-title" className="text-lg font-semibold text-gray-900">
              Borrower Status
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Status: <strong className="text-emerald-600">Cooperative</strong>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              The borrower is engaging with the process and providing requested documentation. No escalation required.
            </p>
            <button
              type="button"
              onClick={() => setShowBorrowerStatusModal(false)}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}