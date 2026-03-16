import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from './components/StatCard'
import ProgressBar from './components/ProgressBar'
import DocumentUpload from '../../components/common/DocumentUpload'
import {
  MOCK_BORROWER_CASE,
  MOCK_TIMELINE_EVENTS,
  MOCK_BORROWER_DOCUMENTS,
} from './data/borrowerMockData'

const formatNum = (n) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)

import { useAuth } from '../../context/AuthContext'

export default function BorrowerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [documents, setDocuments] = useState(MOCK_BORROWER_DOCUMENTS)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadTargetDoc, setUploadTargetDoc] = useState(null)
  const c = MOCK_BORROWER_CASE
  const fin = c.financials || {}
  const addressLine1 = c.property?.address ?? '45 Victoria Street'
  const addressLine2 = c.property ? `${c.property.suburb}, ${c.property.state}` : 'Potts Point, NSW'
  const nextMilestoneDate = c.auction?.endDate
    ? new Date(c.auction.endDate).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '05 Mar 2026'
  const activeBidders = c.auction?.activeBidders ?? 5
  const currentBid = fin.currentHighestBid ?? 2450000
  const pendingDocCount = documents.filter((d) => d.status === 'pending').length

  const supportSectionRef = useRef(null)


  const handleViewAuction = () => navigate('/borrower/auction')
  const handleViewLiveAuction = () => navigate('/borrower/auction')
  const handleUploadDocument = () => {
    setUploadTargetDoc(null)
    setShowUpload(true)
  }
  const handleSupportResources = () => {
    setActiveTab('overview')
    setTimeout(() => supportSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }
  const handleContactSupport = () => {
    window.location.href = 'mailto:support@brickbanq.com?subject=Dashboard%20Support'
  }
  const handleDownloadDocument = (doc) => () => {
    const blob = new Blob([`Document: ${doc.title}\nUploaded: ${doc.uploadedDate}\n\n(This is a placeholder download.)`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.title.replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
  const handleUploadPendingDocument = (doc) => () => {
    setUploadTargetDoc(doc)
    setShowUpload(true)
  }

  const handleUploadSuccess = (fileName) => {
    if (uploadTargetDoc) {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === uploadTargetDoc.id
            ? { ...d, status: 'uploaded', uploadedDate: new Date().toLocaleDateString('en-AU') }
            : d
        )
      )
    }
    // Keep modal open briefly so the success message is visible, then auto-close
    setTimeout(() => setShowUpload(false), 2000)
  }

  const handleSupport = () => {
    setActiveTab('overview')
    setTimeout(() => {
      supportSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }


  return (
    <div className="p-6 md:p-8 space-y-6 bg-gray-50 min-h-full">
      {/* Page title - Figma: "Dashboard" + subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0] || "User"}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your mortgage resolution case</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/borrower/new-case')}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98] transition-transform shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Case
        </button>
      </div>

      {/* My Case Dashboard card - Figma: #1B2433 bg, #232C3D cards, exact fonts and accent colors */}
      <div className="rounded-xl p-5 text-white" style={{ backgroundColor: '#1B2433' }}>
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#232C3D' }} aria-hidden>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">My Case Dashboard</h2>
              <p className="text-base font-normal text-white mt-1" style={{ opacity: 1 }}>Case Number: {c.id}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto sm:min-w-[220px]">
            <button
              type="button"
              onClick={handleViewAuction}
              className="flex items-center justify-center gap-2 bg-white text-black border border-gray-300 text-base font-normal px-4 py-2.5 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-[0.98] transition-transform min-h-[44px] w-full"
            >
              <svg className="w-5 h-5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View My Auction
            </button>
            <button
              type="button"
              onClick={handleSupport}
              className="flex items-center justify-center gap-2 min-h-[44px] bg-white text-black border border-gray-300 text-base font-normal px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-[0.98] transition-transform w-full"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Support
            </button>
          </div>
        </div>
        {/* Four info cards - Figma: #232C3D bg, label #A0A6AD, icons: blue/green/yellow/green */}
        <div className="mt-4 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg px-4 py-3.5" style={{ backgroundColor: '#232C3D' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-normal" style={{ color: '#A0A6AD' }}>Property</span>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="#7CC6FE" viewBox="0 0 24 24"><path stroke="#7CC6FE" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </div>
            <p className="text-lg font-bold text-white mt-2">{addressLine1}</p>
            <p className="text-sm font-normal text-white mt-0.5">{addressLine2}</p>
          </div>
          <div className="rounded-lg px-4 py-3.5" style={{ backgroundColor: '#232C3D' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-normal" style={{ color: '#A0A6AD' }}>Case Status</span>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="#00FF7F" viewBox="0 0 24 24"><path stroke="#00FF7F" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h18v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
            </div>
            <p className="text-lg font-bold text-white mt-2">{c.status || 'Auction'}</p>
            <div className="w-full h-2 rounded-full mt-2 overflow-hidden" style={{ backgroundColor: '#4B5563' }}>
              <div className="h-full rounded-full" style={{ width: '75%', backgroundColor: '#00FF7F' }} />
            </div>
          </div>
          <div className="rounded-lg px-4 py-3.5" style={{ backgroundColor: '#232C3D' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-normal" style={{ color: '#A0A6AD' }}>Next Milestone</span>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="#FFD700" viewBox="0 0 24 24"><path stroke="#FFD700" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-lg font-bold text-white mt-2">Auction End</p>
            <p className="text-sm font-normal mt-0.5" style={{ color: '#FFD700' }}>{nextMilestoneDate}</p>
          </div>
          <div className="rounded-lg px-4 py-3.5" style={{ backgroundColor: '#232C3D' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-normal" style={{ color: '#A0A6AD' }}>Current Bid</span>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="#00FF7F" viewBox="0 0 24 24"><path stroke="#00FF7F" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-lg font-bold text-white mt-2">{formatNum(currentBid)}</p>
            <p className="text-sm font-normal mt-0.5" style={{ color: '#00FF7F' }}>{activeBidders} active bidders</p>
          </div>
        </div>
      </div>

      {/* Alert Banners - side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-wrap items-start gap-3">
          <span className="text-blue-600 text-lg shrink-0" aria-hidden>ℹ️</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-blue-800">Auction Ending Soon</p>
            <p className="text-sm text-blue-800 mt-0.5">
              Your property auction ends in 5 days. Current bid is {formatNum(currentBid)} with {activeBidders} active bidders.
            </p>
            <button
              type="button"
              onClick={handleViewLiveAuction}
              className="mt-2 min-h-[44px] px-4 py-2 bg-white border border-gray-300 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] transition-transform"
            >
              View Live Auction
            </button>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-wrap items-start gap-3">
          <span className="text-amber-600 text-lg shrink-0" aria-hidden>⚠️</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-amber-800">Outstanding Document Required</p>
            <p className="text-sm text-amber-800 mt-0.5">
              Settlement Statement is required for final settlement processing.
            </p>
            <button
              type="button"
              onClick={handleUploadDocument}
              className="mt-2 min-h-[44px] px-4 py-2 bg-white border border-gray-300 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-[0.98] transition-transform"
            >
              Upload Document
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards - 4 in a row, exact Figma styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Property Value"
          value={c.property?.valuation ? formatNum(c.property.valuation) : 'A$3.20M'}
          sub="Independent valuation"
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
        <StatCard
          label="Outstanding Balance"
          value={formatNum(fin.outstandingPrincipal ?? 2940000)}
          sub={
            <span className="text-sm text-red-500">
              Inc. {formatNum(fin.arrearsAndInterest ?? 145000)} arrears
            </span>
          }
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Current Highest Bid"
          value={formatNum(fin.currentHighestBid ?? 2450000)}
          valueColor="text-emerald-600"
          sub={`${activeBidders} active bidders`}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h18v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          }
        />
        <StatCard
          label="Expected Shortfall"
          value={formatNum(fin.expectedShortfall ?? 495000)}
          valueColor="text-amber-600"
          sub="Based on current bid"
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* Tabs - pill style: active = indigo bg white text, inactive = white/dark gray */}
      <div className="border-b border-gray-200 pb-0">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`min-h-[44px] px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 border-b-0 -mb-px hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`min-h-[44px] px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              activeTab === 'timeline'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 border-b-0 -mb-px hover:bg-gray-50'
            }`}
          >
            Timeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`min-h-[44px] px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              activeTab === 'documents'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 border-b-0 -mb-px hover:bg-gray-50'
            }`}
          >
            Documents
            {pendingDocCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500 text-white">
                {pendingDocCount} pending
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Breakdown</h2>
            <div className="space-y-0">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 text-sm">
                <span className="text-gray-700">Original Loan Amount</span>
                <span className="font-medium text-gray-900">{formatNum(fin.originalLoanAmount ?? 2800000)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 text-sm">
                <span className="text-gray-700">Outstanding Principal</span>
                <span className="font-medium text-gray-900">{formatNum(fin.outstandingPrincipal ?? 2800000)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 text-sm">
                <span className="text-gray-700">Arrears & Interest</span>
                <span className="font-medium text-red-500">{formatNum(fin.arrearsAndInterest ?? 145000)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 text-sm">
                <span className="text-gray-700">Selling Costs (est.)</span>
                <span className="font-medium text-gray-900">{formatNum(fin.sellingCostsEst ?? 48000)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 text-sm">
                <span className="text-gray-700">Total Amount Owed</span>
                <span className="font-bold text-gray-900">{formatNum(fin.totalAmountOwed ?? 3018000)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 text-sm bg-emerald-50/50">
                <span className="text-gray-700">Current Highest Bid</span>
                <span className="font-medium text-emerald-600">{formatNum(fin.currentHighestBid ?? 2450000)}</span>
              </div>
              <div className="flex justify-between items-center py-3 text-sm bg-amber-50/50">
                <span className="text-gray-700">Expected Shortfall</span>
                <span className="font-medium text-amber-600">{formatNum(fin.expectedShortfall ?? 495000)}</span>
              </div>
            </div>
          </div>

          <div ref={supportSectionRef} id="support-section" className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              Your Rights & Support
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Financial Hardship:</strong> If you're experiencing financial hardship, you may be eligible for assistance programs or payment arrangements.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Legal Advice:</strong> We recommend seeking independent legal advice about your rights and obligations.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Free Resources:</strong> National Debt Helpline: 1800 007 007 (free financial counselling)
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                type="button"
                onClick={handleSupportResources}
                className="min-h-[44px] inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-[0.98] transition-transform"
              >
                <span className="text-gray-500">?</span>
                Support Resources
              </button>
              <button
                type="button"
                onClick={handleContactSupport}
                className="min-h-[44px] inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:scale-[0.98] transition-transform"
              >
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        </>
      )}

      {/* Timeline tab - vertical timeline, green/grey line, icons */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="relative">
            {MOCK_TIMELINE_EVENTS.map((event, index) => {
              const isLast = index === MOCK_TIMELINE_EVENTS.length - 1
              const isCompleted = event.completed
              return (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {event.icon === 'check' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {event.icon === 'document' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {event.icon === 'chart' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h18v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      )}
                      {event.icon === 'clock' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {event.icon === 'dollar' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 mt-2 flex-shrink-0 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`}
                        style={{ height: 48, width: 2 }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-wrap justify-between gap-2 pt-0.5 pb-8">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
                    </div>
                    {event.date && (
                      <p className="text-sm text-gray-500 shrink-0">{event.date}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Documents tab - green cards (uploaded) + yellow card (pending) */}
      {activeTab === 'documents' && (
        <div id="dashboard-documents-section" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) =>
            doc.status === 'uploaded' ? (
              <div
                key={doc.id}
                className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">{doc.title}</p>
                    <p className="text-sm text-gray-600">Uploaded {doc.uploadedDate}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadDocument(doc)}
                  className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shrink-0 flex items-center justify-center"
                  aria-label={`Download ${doc.title}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                key={doc.id}
                className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">{doc.title}</p>
                    <p className="text-sm text-gray-600">{doc.requirement}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleUploadPendingDocument(doc)}
                  className="min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98] transition-transform"
                >
                  Upload
                </button>
              </div>
            )
          )}
        </div>
      )}


      {/* Document Upload Modal */}
      {showUpload && (
        <DocumentUpload
          documentLabel={uploadTargetDoc?.title ?? 'Settlement Statement'}
          onSuccess={handleUploadSuccess}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  )
}
