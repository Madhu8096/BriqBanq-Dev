import { useState } from 'react'
import { borrowerApi } from '../../api'
import {
  MOCK_LAWYER_REVIEW_DOCS,
  MOCK_ENFORCEMENT_STEPS,
  MOCK_LOAN_COMPLIANCE_ITEMS,
} from '../../data/borrowerMockData'
import { MOCK_BORROWER_CASE } from '../../data/borrowerMockData'

export default function LawyerReviewTab({ caseId }) {
  const [nccpYes, setNccpYes] = useState(true)
  const [enforcement, setEnforcement] = useState(
    MOCK_ENFORCEMENT_STEPS.map((s) => ({ ...s }))
  )
  const [compliance, setCompliance] = useState(
    MOCK_LOAN_COMPLIANCE_ITEMS.map((c) => ({ ...c }))
  )
  const [reviewNotes, setReviewNotes] = useState('')
  const [soaFile, setSoaFile] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [actionError, setActionError] = useState(null)

  const c = MOCK_BORROWER_CASE || {}
  const addr = c.property ? `${c.property.address}, ${c.property.suburb}, ${c.property.state} ${c.property.postcode || ''}`.trim() : ''

  const toggleEnforcement = (id) => {
    setEnforcement((prev) =>
      prev.map((e) => (e.id === id ? { ...e, checked: !e.checked } : e))
    )
  }
  const toggleCompliance = (id) => {
    setCompliance((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    )
  }
  const reviewProgress = Math.round(
    (enforcement.length + compliance.length) > 0
      ? ((enforcement.filter((e) => e.checked).length + compliance.filter((c) => c.checked).length) /
          (enforcement.length + compliance.length)) *
          100
      : 0
  )

  const requiredIncomplete = enforcement.filter((e) => e.required && !e.checked).length
  const criticalIncomplete = compliance.filter((c) => c.critical && !c.checked).length
  const criticalIssues = requiredIncomplete + criticalIncomplete
  const reviewedCount = 0 // Document review 0/10 in Figma

  const handleViewDoc = (id) => {
    window.open(`/api/borrower/documents/${id}/view`, '_blank')
  }
  const handleDownloadDoc = (id) => {
    const link = document.createElement('a')
    link.href = '#'
    link.download = `document-${id}.pdf`
    link.click()
  }
  const handleSoaSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) setSoaFile(file)
  }
  const handleRejectCase = async () => {
    if (!window.confirm('Reject this case? This action may be recorded.')) return
    setActionError(null)
    setActionLoading('reject')
    try {
      await borrowerApi.rejectCase(caseId, { reason: reviewNotes })
    } catch (err) {
      setActionError(err?.response?.data?.message || err?.message || 'Reject failed.')
    } finally {
      setActionLoading(null)
    }
  }
  const handleApproveCase = async () => {
    if (criticalIssues > 0) return
    if (!window.confirm('Approve this case?')) return
    setActionError(null)
    setActionLoading('approve')
    try {
      await borrowerApi.approveCase(caseId, { notes: reviewNotes })
    } catch (err) {
      setActionError(err?.response?.data?.message || err?.message || 'Approve failed.')
    } finally {
      setActionLoading(null)
    }
  }


  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Legal Review & Compliance</h2>
        <p className="text-sm text-gray-500 mt-1">Comprehensive legal review for {caseId || 'MIP-2026-001'}.</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${reviewProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">In Review — {reviewProgress}%</p>
          </div>
        </div>
        {criticalIssues > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800">
              {requiredIncomplete} required enforcement steps incomplete • {criticalIncomplete} critical compliance issues
            </p>
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
          <span>Property: {addr || '—'}</span>
          <span>Borrower: {c.borrower?.name || c.borrower || '—'}</span>
          <span>Outstanding Debt: ${Number(c.lender?.outstandingDebt ?? c.financials?.outstandingPrincipal ?? 980000).toLocaleString()}</span>
          <span>Valuation: ${Number(c.property?.valuation ?? 1250000).toLocaleString()}</span>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">NCCP Loan Determination</h2>
        <p className="text-sm text-gray-500 mt-1">National Consumer Credit Protection requirements apply to this loan.</p>
        <p className="text-sm font-medium text-gray-700 mt-3">Is this an NCCP loan?</p>
        <div className="flex gap-6 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="nccp"
              checked={nccpYes}
              onChange={() => setNccpYes(true)}
              className="rounded-full border-gray-300 text-blue-600"
            />
            <span className="text-sm">Yes - NCCP</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="nccp"
              checked={!nccpYes}
              onChange={() => setNccpYes(false)}
              className="rounded-full border-gray-300 text-blue-600"
            />
            <span className="text-sm">No - Not NCCP</span>
          </label>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Document Review ({reviewedCount}/{MOCK_LAWYER_REVIEW_DOCS.length})</h2>
        <ul className="mt-4 divide-y divide-gray-200">
          {MOCK_LAWYER_REVIEW_DOCS.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between py-3 first:pt-0">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 border border-gray-400 rounded" aria-hidden />
                <span className="text-sm font-medium text-gray-900">{doc.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleViewDoc(doc.id)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded"
                  title="View"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(doc.id)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded"
                  title="Download"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Enforcement Steps Verification</h2>
        <p className="text-sm text-gray-500 mt-1">Verify that all required enforcement steps have been completed correctly and in accordance with legislation.</p>
        <ul className="mt-4 space-y-2">
          {enforcement.map((e) => (
            <li key={e.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={e.id}
                checked={e.checked}
                onChange={() => toggleEnforcement(e.id)}
                className="rounded border-gray-300 text-blue-600 h-4 w-4"
              />
              <label htmlFor={e.id} className="flex-1 text-sm text-gray-900 cursor-pointer">{e.label}</label>
              {e.required && <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">Required</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Loan Compliance - Buyer Protection</h2>
        <p className="text-sm text-gray-500 mt-1">Ensure the loan is fully compliant and will present no legal issues for the buyer/investor.</p>
        <ul className="mt-4 space-y-2">
          {compliance.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={item.id}
                checked={item.checked}
                onChange={() => toggleCompliance(item.id)}
                className="rounded border-gray-300 text-blue-600 h-4 w-4"
              />
              <label htmlFor={item.id} className="flex-1 text-sm text-gray-900 cursor-pointer">{item.label}</label>
              {item.critical && <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">Critical</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Statement of Advice</h2>
        <div className="mt-2 flex flex-wrap gap-4 items-center">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option>Brickbanq Platform</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option>Borrower</option>
          </select>
          <span className="text-sm text-gray-600">David Williams DW</span>
        </div>
        <div
          className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => document.getElementById('soa-upload').click()}
        >
          <input
            id="soa-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleSoaSelect}
          />
          <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600">
            {soaFile ? soaFile.name : 'Click to upload Statement of Advice PDF, DOC, or DOCX (Max 10MB).'}
          </p>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Review Notes & Recommendations</h2>
        <textarea
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          placeholder="Provide detailed review notes, findings, and recommendations."
          className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </section>

      <div className="flex flex-wrap items-center gap-4">
        {criticalIssues > 0 && (
          <p className="text-sm font-medium text-red-600">A Critical issues must be resolved.</p>
        )}
        {actionError && (
          <p className="text-sm text-red-600" role="alert">
            {actionError}
          </p>
        )}
        <div className="flex gap-3 ml-auto">
          <button
            type="button"
            onClick={handleRejectCase}
            disabled={!!actionLoading}
            className="border border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50 text-sm font-medium px-4 py-2 rounded-lg"
          >
            {actionLoading === 'reject' ? 'Rejecting…' : 'Reject Case'}
          </button>
          <button
            type="button"
            onClick={handleApproveCase}
            disabled={criticalIssues > 0 || !!actionLoading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            {actionLoading === 'approve' ? 'Approving…' : 'Approve Case'}
          </button>
        </div>
      </div>
    </div>
  )
}
