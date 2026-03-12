export default function BidsTab({ bids = [] }) {
  if (bids.length === 0) {
    return <p className="text-sm text-slate-500">No bids available.</p>
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Bid History</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Bidder</th>
              <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Bid Amount</th>
              <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Timestamp</th>
              <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {bids.map((bid) => (
              <tr key={bid.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm text-slate-900">{bid.bidder}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  ${Number(bid.amount).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{bid.timestamp}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded ${
                    bid.status === 'Active'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {bid.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
