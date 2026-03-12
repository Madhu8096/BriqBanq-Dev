import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { borrowerApi } from './api'
import { FALLBACK_CASE_ID } from './data/fallbackData'
import { MOCK_CASE_DATA } from './data/borrowerMockData'
import CaseHeader from './my-case/CaseHeader'
import ManageCaseModal from './my-case/ManageCaseModal'
import TabNavigation from './my-case/TabNavigation'
import OverviewTab from './my-case/tabs/OverviewTab'
import PropertyTab from './my-case/tabs/PropertyTab'
import DocumentsTab from './my-case/tabs/DocumentsTab'
import InvestmentMemoTab from './my-case/tabs/InvestmentMemoTab'
import SettlementTab from './my-case/tabs/SettlementTab'
import BidsTab from './my-case/tabs/BidsTab'
import MessagesTab from './my-case/tabs/MessagesTab'
import ActivityTab from './my-case/tabs/ActivityTab'

const d = (r) => r?.data?.data !== undefined ? r.data.data : r?.data

function mergeCaseData(details, summary, financial) {
  const det = details && typeof details === 'object' ? details : {}
  const sum = summary && typeof summary === 'object' ? summary : {}
  const fin = financial && typeof financial === 'object' ? financial : {}
  
  const outstandingDebt = Number(fin.outstandingDebt ?? fin.outstanding_debt ?? det.outstandingDebt ?? MOCK_CASE_DATA.outstandingDebt)
  const propertyValuation = Number(fin.propertyValuation ?? fin.property_valuation ?? det.propertyValuation ?? MOCK_CASE_DATA.propertyValuation)
  const equityAvailable = Number(fin.equityAvailable ?? fin.equity_available ?? (propertyValuation - outstandingDebt))
  const minimumBid = Number(fin.minimumBid ?? fin.minimum_bid ?? outstandingDebt)
  const currentHighestBid = Number(fin.currentHighestBid ?? fin.current_highest_bid ?? sum.currentHighestBid ?? sum.current_highest_bid ?? 0)
  
  return {
    id: det.id ?? sum.caseId ?? sum.case_id ?? MOCK_CASE_DATA.id,
    status: det.status ?? sum.status ?? MOCK_CASE_DATA.status,
    riskLevel: det.riskLevel ?? det.risk_level ?? sum.riskLevel ?? MOCK_CASE_DATA.riskLevel,
    borrower: det.borrower ?? sum.borrower ?? MOCK_CASE_DATA.borrower,
    lender: det.lender ?? sum.lender ?? MOCK_CASE_DATA.lender,
    outstandingDebt,
    propertyValuation,
    equityAvailable,
    minimumBid,
    currentHighestBid,
    created: sum.created ?? sum.created_at ?? det.created ?? det.created_at ?? '—',
    lastUpdated: sum.lastUpdated ?? sum.last_updated ?? det.lastUpdated ?? det.last_updated ?? '—',
    tasksReceived: Number(sum.tasksReceived ?? sum.tasks_received ?? det.tasksReceived ?? 0),
    property: {
      address: det.address ?? sum.address ?? MOCK_CASE_DATA.property.address,
      location: det.location ?? sum.location ?? MOCK_CASE_DATA.property.location,
      type: det.propertyType ?? det.property_type ?? MOCK_CASE_DATA.property.type,
      bedrooms: Number(det.bedrooms ?? MOCK_CASE_DATA.property.bedrooms),
      bathrooms: Number(det.bathrooms ?? MOCK_CASE_DATA.property.bathrooms),
      parking: Number(det.parking ?? MOCK_CASE_DATA.property.parking),
      image: det.propertyImage ?? det.property_image ?? MOCK_CASE_DATA.property.image
    },
    valuation: {
      amount: propertyValuation,
      date: det.valuationDate ?? det.valuation_date ?? MOCK_CASE_DATA.valuation.date,
      valuer: det.valuer ?? MOCK_CASE_DATA.valuation.valuer
    },
    documents: det.documents ?? sum.documents ?? MOCK_CASE_DATA.documents,
    settlement: det.settlement ?? sum.settlement ?? MOCK_CASE_DATA.settlement,
    bids: det.bids ?? sum.bids ?? MOCK_CASE_DATA.bids,
    messages: det.messages ?? sum.messages ?? MOCK_CASE_DATA.messages,
    activity: det.activity ?? sum.activity ?? MOCK_CASE_DATA.activity
  }
}

export default function MyCase() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [caseId, setCaseId] = useState('')
  const [caseData, setCaseData] = useState(null)
  const [manageCaseModalOpen, setManageCaseModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setError(null)
    setLoading(true)
    
    const load = async () => {
      let id = ''
      try {
        id = localStorage.getItem('borrowerCaseId') || ''
        if (!id) {
          try {
            const statsRes = await borrowerApi.getDashboardStats()
            const s = d(statsRes)
            id = s?.caseId ?? s?.case_id ?? ''
            if (id) localStorage.setItem('borrowerCaseId', String(id))
          } catch (_) {}
        }
        if (!id) {
          try {
            const casesRes = await borrowerApi.getCases()
            const list = Array.isArray(casesRes?.data) ? casesRes.data : casesRes?.data?.data ?? casesRes?.data?.cases ?? casesRes?.data?.items ?? []
            const first = list[0]
            id = first?.id ?? first?.caseId ?? first?.case_id ?? ''
            if (id) localStorage.setItem('borrowerCaseId', String(id))
          } catch (_) {}
        }
        
        if (cancelled) return
        
        const resolvedId = id || FALLBACK_CASE_ID
        setCaseId(resolvedId)
        
        if (!id) {
          setCaseData(MOCK_CASE_DATA)
          setLoading(false)
          return
        }
        
        try {
          const [detailsRes, summaryRes, financialRes] = await Promise.all([
            borrowerApi.getCaseDetails(id),
            borrowerApi.getCaseSummary(id),
            borrowerApi.getFinancialOverview(id)
          ])
          
          if (cancelled) return
          
          const details = d(detailsRes)
          const summary = d(summaryRes)
          const financial = d(financialRes)
          const merged = mergeCaseData(details, summary, financial)
          
          if (merged.id || merged.property?.address || merged.borrower) {
            setCaseData(merged)
          } else {
            setCaseData(MOCK_CASE_DATA)
          }
        } catch (err) {
          if (!cancelled) {
            const isNetworkError = err?.code === 'ERR_NETWORK' || err?.message === 'Network Error'
            if (!isNetworkError) setError(err?.message || 'Failed to load case')
            setCaseData(MOCK_CASE_DATA)
          }
        }
      } catch (e) {
        if (!cancelled) {
          setCaseId(FALLBACK_CASE_ID)
          setCaseData(MOCK_CASE_DATA)
          const isNetworkError = e?.code === 'ERR_NETWORK' || e?.message === 'Network Error'
          if (!isNetworkError) setError(e?.message || 'Failed to load case')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    
    load()
    return () => { cancelled = true }
  }, [])

  const handleExportReport = () => {
    if (!caseData) return
    const lines = [
      'Case Export Report',
      `Case ID,${caseData.id}`,
      `Address,${caseData.property?.address || ''}`,
      `Status,${caseData.status}`,
      `Borrower,${caseData.borrower}`,
      `Lender,${caseData.lender}`,
      `Outstanding Debt,$${Number(caseData.outstandingDebt).toLocaleString()}`,
      `Property Valuation,$${Number(caseData.propertyValuation).toLocaleString()}`,
      '',
      'Generated from Brickbanq Borrower Panel'
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `case-report-${caseData.id || 'case'}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleManageCase = () => {
    setManageCaseModalOpen(true)
  }

  const handleManageCaseModalClose = () => {
    setManageCaseModalOpen(false)
  }

  const handleManageCaseSave = async (payload) => {
    // Backend: PATCH case details, upload images, save AI content
    const { caseDetails: cd } = payload || {}
    if (caseData && cd) {
      const val = (n) => (n === '' || n === undefined ? undefined : Number(n))
      setCaseData((prev) => ({
        ...prev,
        id: cd.caseNumber ?? prev.id,
        borrower: cd.borrowerName ?? prev.borrower,
        lender: cd.lenderName ?? prev.lender,
        outstandingDebt: val(cd.outstandingDebt) ?? prev.outstandingDebt,
        propertyValuation: val(cd.valuationAmount) ?? prev.propertyValuation,
        property: {
          ...prev.property,
          address: cd.address ?? prev.property?.address,
          location: [cd.suburb, cd.postcode].filter(Boolean).join(', ') || prev.property?.location,
          bedrooms: val(cd.bedrooms) ?? prev.property?.bedrooms,
          bathrooms: val(cd.bathrooms) ?? prev.property?.bathrooms,
        },
        valuation: {
          ...prev.valuation,
          amount: val(cd.valuationAmount) ?? prev.valuation?.amount,
          date: cd.valuationDate ?? prev.valuation?.date,
          valuer: cd.valuerName ?? prev.valuation?.valuer,
        },
      }))
    }
  }

  const handleDocumentUploaded = () => {
    // Refresh documents list
    // In production, refetch case data
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab caseData={caseData} />
      case 'property':
        return <PropertyTab data={caseData?.property} valuation={caseData?.valuation} />
      case 'documents':
        return <DocumentsTab documents={caseData?.documents} caseId={caseData?.id} onDocumentUploaded={handleDocumentUploaded} />
      case 'investment-memo':
        return <InvestmentMemoTab caseId={caseData?.id} />
      case 'settlement':
        return <SettlementTab settlement={caseData?.settlement} property={caseData?.property} caseId={caseData?.id} />
      case 'bids':
        return <BidsTab bids={caseData?.bids} />
      case 'messages':
        return <MessagesTab messages={caseData?.messages} caseId={caseData?.id} />
      case 'activity':
        return <ActivityTab activities={caseData?.activity} />
      default:
        return <OverviewTab caseData={caseData} />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Case Workspace</h1>
        <div className="flex items-center justify-center py-20 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  if (!caseId || !caseData) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Case Workspace</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your mortgage resolution case</p>
        {error && <p className="text-sm text-amber-600 mt-1">{error}</p>}
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-600">No active case found.</p>
          <p className="text-sm text-slate-500 mt-2">Your case will appear here once it has been created and assigned to you.</p>
          <button
            type="button"
            onClick={() => navigate('/borrower/dashboard')}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Case Workspace</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your mortgage resolution case</p>
        {error && <p className="text-sm text-amber-600 mt-1">{error}</p>}
      </div>

      <CaseHeader
        caseId={caseData.id}
        status={caseData.status}
        riskLevel={caseData.riskLevel}
        property={caseData.property}
        borrower={caseData.borrower}
        lender={caseData.lender}
        outstandingDebt={caseData.outstandingDebt}
        propertyValuation={caseData.propertyValuation}
        onExportReport={handleExportReport}
        onManageCase={handleManageCase}
      />

      <ManageCaseModal
        caseData={caseData}
        isOpen={manageCaseModalOpen}
        onClose={handleManageCaseModalClose}
        onSave={handleManageCaseSave}
      />

      <div className="bg-white rounded-lg border border-slate-200">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  )
}
