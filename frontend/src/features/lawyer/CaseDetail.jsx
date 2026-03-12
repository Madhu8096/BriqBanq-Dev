import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { MOCK_CASES } from './data/mockData'
import RiskBadge from './components/RiskBadge'
import StatusBadge from './components/StatusBadge'

export default function CaseDetail() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const caseItem = useMemo(
    () => MOCK_CASES.find((c) => c.id === caseId || c.caseNumber === caseId) ?? null,
    [caseId]
  )

  if (!caseItem) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          type="button"
          onClick={() => navigate('/lawyer/assigned-cases')}
          className="text-[#6366F1] text-sm font-medium hover:underline"
        >
          ← Back to Cases
        </button>
        <p className="text-gray-600">Case not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        type="button"
        onClick={() => navigate('/lawyer/assigned-cases')}
        className="text-[#6366F1] text-sm font-medium hover:underline"
      >
        ← Back to Cases
      </button>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">{caseItem.caseNumber}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Case details</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Borrower</p>
            <p className="font-medium text-gray-900">{caseItem.borrower}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Property</p>
            <p className="font-medium text-gray-900">{caseItem.property}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Debt</p>
            <p className="font-medium text-gray-900">{caseItem.debt}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <StatusBadge status={caseItem.status} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Risk</p>
            <RiskBadge risk={caseItem.risk} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-medium text-gray-900">{caseItem.created}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
