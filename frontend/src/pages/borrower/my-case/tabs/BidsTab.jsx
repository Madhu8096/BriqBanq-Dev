export default function BidsTab({ bids = [] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Bid History</h3>
      </div>
      {bids.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-gray-500">No bids available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-600 px-6 py-3">Bidder</th>
                <th className="text-left text-sm font-medium text-gray-600 px-6 py-3">Bid Amount</th>
                <th className="text-left text-sm font-medium text-gray-600 px-6 py-3">Timestamp</th>
                <th className="text-left text-sm font-medium text-gray-600 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bids.map((bid) => (
                <tr key={bid.id ?? bid.user ?? bid.bidder} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{bid.bidder ?? bid.user}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${Number(bid.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{bid.timestamp ?? bid.time}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                        bid.status === 'winning'
                          ? 'bg-blue-600 text-white'
                          : bid.status === 'outbid'
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {bid.status === 'winning' ? 'winning' : bid.status === 'outbid' ? 'outbid' : (bid.status || '—')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
