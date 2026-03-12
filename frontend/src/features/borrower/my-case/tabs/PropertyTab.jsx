export default function PropertyTab({ data, valuation }) {
  if (!data) {
    return <p className="text-sm text-slate-500">No property data available.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Details</h3>
        
        <div className="mb-6">
          <p className="text-sm text-slate-600 mb-2">Address</p>
          <p className="text-base font-medium text-slate-900">{data.address || '—'}</p>
          {data.location && <p className="text-sm text-slate-600">{data.location}</p>}
        </div>

        <div>
          <p className="text-sm text-slate-600 mb-3">Property Features</p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-600">Type</p>
              <p className="text-base font-medium text-slate-900 mt-1">{data.type || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Bedrooms</p>
              <p className="text-base font-medium text-slate-900 mt-1">{data.bedrooms ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Bathrooms</p>
              <p className="text-base font-medium text-slate-900 mt-1">{data.bathrooms ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Parking</p>
              <p className="text-base font-medium text-slate-900 mt-1">{data.parking ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {valuation && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Valuation</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-600">Valuation Amount</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {valuation.amount ? `$${Number(valuation.amount).toLocaleString()}` : '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Valuation Date</p>
              <p className="text-base font-medium text-slate-900 mt-1">{valuation.date || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Valuer</p>
              <p className="text-base font-medium text-slate-900 mt-1">{valuation.valuer || '—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
