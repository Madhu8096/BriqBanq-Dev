export default function CaseHeader({ caseId, status, riskLevel, property, borrower, lender, outstandingDebt, propertyValuation, onExportReport, onManageCase }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{caseId}</h1>
            {status && (
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded bg-indigo-100 text-indigo-700">
                {status}
              </span>
            )}
            {riskLevel && (
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded bg-amber-100 text-amber-700">
                {riskLevel}
              </span>
            )}
          </div>
          {property?.address && (
            <p className="text-sm text-slate-600">
              {property.address}{property.location ? `, ${property.location}` : ''}
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onExportReport}
            className="border border-slate-300 bg-white text-slate-700 text-sm px-4 py-2 rounded hover:bg-slate-50"
          >
            Export Report
          </button>
          <button
            type="button"
            onClick={onManageCase}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded"
          >
            Manage Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 pt-6 border-t border-slate-200">
        <div>
          <p className="text-sm text-slate-600">Borrower</p>
          <p className="text-base font-medium text-slate-900 mt-1">{borrower || '—'}</p>
        </div>
        <div>
          <p className="text-sm text-slate-600">Lender</p>
          <p className="text-base font-medium text-slate-900 mt-1">{lender || '—'}</p>
        </div>
        <div>
          <p className="text-sm text-slate-600">Outstanding Debt</p>
          <p className="text-base font-medium text-slate-900 mt-1">
            {outstandingDebt ? `$${Number(outstandingDebt).toLocaleString()}` : '—'}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-600">Property Valuation</p>
          <p className="text-base font-medium text-slate-900 mt-1">
            {propertyValuation ? `$${Number(propertyValuation).toLocaleString()}` : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
