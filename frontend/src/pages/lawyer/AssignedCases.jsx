import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import CaseCard from './components/CaseCard'
import RiskBadge from './components/RiskBadge'
import NewCase from '../borrower/NewCase'
import { MOCK_CASES, MOCK_CASE_STATS } from './data/mockData'

const STAT_ICONS = {
  total: () => <svg className="w-8 h-8 text-[#3474E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  active: () => <svg className="w-8 h-8 text-[#00C853]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  inAuction: () => <svg className="w-8 h-8 text-[#FF4500]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  completed: () => <svg className="w-8 h-8 text-[#6A0DAD]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
}

export default function AssignedCases() {
  const navigate = useNavigate()
  const [cases, setCases] = useState(MOCK_CASES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [showNewCase, setShowNewCase] = useState(false)
  const [showTestIdModal, setShowTestIdModal] = useState(false)

  const filtered = useMemo(() => {
    let list = [...cases]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          (c.caseNumber && c.caseNumber.toLowerCase().includes(q)) ||
          (c.borrower && c.borrower.toLowerCase().includes(q)) ||
          (c.propertyAddress && c.propertyAddress.toLowerCase().includes(q)) ||
          (c.propertySuburb && c.propertySuburb.toLowerCase().includes(q))
      )
    }
    if (statusFilter && statusFilter !== 'All Status') {
      list = list.filter((c) => c.status === statusFilter)
    }
    return list
  }, [cases, search, statusFilter])

  const handleStatusChange = (id, status) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
  }

  const handleView = (id) => navigate(`/lawyer/assigned-cases/${id}`)

  const handleDelete = (id) => {
    setCases((prev) => prev.filter((c) => c.id !== id))
  }

  const handleRefresh = () => {
    setCases([...MOCK_CASES])
    setSearch('')
    setStatusFilter('All Status')
  }

  const [testRunning, setTestRunning] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const handleTestIdSystem = () => {
    setTestResult(null)
    setShowTestIdModal(true)
  }
  const closeTestIdModal = () => {
    setShowTestIdModal(false)
    setTestRunning(false)
    setTestResult(null)
  }
  const handleRunTest = async () => {
    setTestRunning(true)
    setTestResult(null)
    await new Promise((r) => setTimeout(r, 1500))
    setTestRunning(false)
    setTestResult('passed')
  }

  const handleNewCaseSuccess = () => {
    setShowNewCase(false)
    const created = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
    const id = `MIP-2026-${String(Date.now()).slice(-6)}`
    setCases((prev) => [
      {
        id,
        caseNumber: id,
        borrower: 'New case submitted',
        propertyAddress: '—',
        propertySuburb: '—',
        debt: '—',
        valuation: '—',
        status: 'Pending',
        risk: 'Medium Risk',
        created,
      },
      ...prev,
    ])
  }

  const handleExport = () => {
    const csv = [
      ['Case Number', 'Borrower', 'Property', 'Debt', 'Valuation', 'Status', 'Risk', 'Created'].join(','),
      ...filtered.map((c) =>
        [c.caseNumber, c.borrower, `${c.propertyAddress} ${c.propertySuburb}`, c.debt, c.valuation, c.status, c.risk, c.created].join(',')
      ),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'assigned-cases.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const stats = {
    total: cases.length,
    active: cases.filter((c) => c.status === 'Active').length,
    inAuction: cases.filter((c) => c.status === 'In Auction').length,
    completed: cases.filter((c) => c.status === 'Completed').length,
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative pb-20">
      <h1 className="text-2xl font-bold text-[#2A3037]">Assigned Cases</h1>

      <div className="flex justify-end">
        <button type="button" onClick={() => setShowNewCase(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3474E1] text-white text-sm font-medium hover:bg-[#2a5fc4]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Submit New Case
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'total', label: 'Total Cases', value: stats.total, icon: 'total' },
          { key: 'active', label: 'Active Cases', value: stats.active, icon: 'active' },
          { key: 'inAuction', label: 'In Auction', value: stats.inAuction, icon: 'inAuction' },
          { key: 'completed', label: 'Completed', value: stats.completed, icon: 'completed' },
        ].map((s) => (
          <div key={s.key} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-[#2A3037]">{s.value}</p>
            </div>
            {STAT_ICONS[s.icon] && <div className="flex-shrink-0">{STAT_ICONS[s.icon]()}</div>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-[#2A3037]">All Cases ({filtered.length})</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cases..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-[#2A3037]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-[#2A3037]"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="In Auction">In Auction</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <button type="button" onClick={handleRefresh} className="px-3 py-2 rounded-lg bg-gray-100 text-[#2A3037] text-sm font-medium hover:bg-gray-200 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </button>
            <button type="button" onClick={handleExport} className="px-3 py-2 rounded-lg bg-gray-100 text-[#2A3037] text-sm font-medium hover:bg-gray-200 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 font-medium text-[#2A3037]">Case Number</th>
                <th className="py-3 px-4 font-medium text-[#2A3037]">Borrower</th>
                <th className="py-3 px-4 font-medium text-[#2A3037]">Property</th>
                <th className="py-3 px-4 font-medium text-[#2A3037]">Debt</th>
                <th className="py-3 px-4 font-medium text-[#2A3037]">Valuation</th>
                <th className="py-3 px-4 font-medium text-[#2A3037]">Status</th>
                <th className="py-3 px-4 font-medium text-[#2A3037]">Risk</th>
                <th className="py-3 px-4 font-medium text-[#2A3037]">Created</th>
                <th className="py-3 px-4 font-medium text-[#2A3037]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-[#2A3037]">{row.caseNumber}</td>
                  <td className="py-3 px-4 text-[#2A3037]">{row.borrower}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-[#2A3037]">{row.propertyAddress}</p>
                    <p className="text-gray-500 text-xs">{row.propertySuburb}</p>
                  </td>
                  <td className="py-3 px-4 text-[#2A3037]">{row.debt}</td>
                  <td className="py-3 px-4 text-[#2A3037]">{row.valuation}</td>
                  <td className="py-3 px-4">
                    <select
                      value={row.status}
                      onChange={(e) => handleStatusChange(row.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white text-[#2A3037]"
                    >
                      <option value="Active">Active</option>
                      <option value="In Auction">In Auction</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge risk={row.risk} />
                  </td>
                  <td className="py-3 px-4 text-gray-600">{row.created}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <button type="button" onClick={() => handleView(row.id)} className="p-2 rounded-md text-[#2A3037] hover:bg-gray-100" aria-label="View">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <button type="button" onClick={() => handleDelete(row.id)} className="p-2 rounded-md text-red-600 hover:bg-red-50" aria-label="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden p-4 space-y-4">
          {filtered.map((c) => (
            <CaseCard
              key={c.id}
              case={{ ...c, property: c.propertyAddress ? `${c.propertyAddress}, ${c.propertySuburb || ''}` : c.propertySuburb }}
              onView={handleView}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>

      {/* New Case – full-screen overlay (same as borrower dashboard) */}
      {showNewCase && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-case-title"
        >
          <div className="flex-shrink-0 flex justify-end items-center p-2 md:p-3 border-b border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setShowNewCase(false)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close New Case"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50 p-4 md:p-6 lg:p-8">
            <NewCase onClose={() => setShowNewCase(false)} onSuccess={handleNewCaseSuccess} />
          </div>
        </div>
      )}

      {/* Test ID System - floating action button (Figma: bottom right) */}
      <button
        type="button"
        onClick={handleTestIdSystem}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-xl bg-[#3474E1] text-white text-sm font-medium hover:bg-[#2a5fc4] shadow-lg shadow-[#3474E1]/30"
        aria-label="Test ID System"
      >
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        Test ID System
      </button>

      {showTestIdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="test-id-title" onClick={closeTestIdModal}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h2 id="test-id-title" className="text-xl font-semibold text-[#2A3037]">Test ID System</h2>
              <button type="button" onClick={closeTestIdModal} className="p-1.5 text-gray-400 hover:text-gray-600 rounded" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Run identity verification and KYC test flows for development or QA. Connect to your configured ID provider (e.g. GreenID, InfoTrack) to validate document and identity checks.
            </p>
            {testResult === 'passed' && (
              <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                All ID system checks passed successfully.
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={closeTestIdModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-[#2A3037] bg-white hover:bg-gray-50">Close</button>
              <button
                type="button"
                onClick={handleRunTest}
                disabled={testRunning || testResult === 'passed'}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed ${testResult === 'passed' ? 'bg-emerald-600 text-white' : 'bg-[#3474E1] hover:bg-[#2a5fc4] text-white disabled:opacity-60'}`}
              >
                {testRunning ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Running…
                  </>
                ) : testResult === 'passed' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    Test Passed
                  </>
                ) : 'Run Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
