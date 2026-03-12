import { useState } from 'react'

export default function SettlementTab({ settlement, property, caseId }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(settlement?.messages || [])

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      avatar: 'U',
      message: message,
      timestamp: 'Just now',
      isUser: true
    }
    
    setMessages([...messages, newMessage])
    setMessage('')
  }

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete':
      case 'approved':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'overdue':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getTimelineStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return 'bg-green-500'
      case 'pending':
        return 'bg-amber-500'
      default:
        return 'bg-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      {property && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {property.image && (
              <img
                src={property.image}
                alt="Property"
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div>
              <p className="text-sm text-slate-600">Case {caseId}</p>
              <p className="text-base font-semibold text-slate-900">
                {property.address}
              </p>
              {property.location && (
                <p className="text-sm text-slate-600">{property.location}</p>
              )}
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-700 mt-1">
                Pending Review
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Settlement Readiness</p>
            <p className="text-2xl font-bold text-slate-900">
              {settlement?.readiness || 0}%
            </p>
            <button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-1.5 rounded">
              Mark Ready for Settlement
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Settlement Checklist</h3>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-1.5 rounded">
                Add Item
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Task</th>
                  <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Responsible</th>
                  <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Due Date</th>
                  <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Status</th>
                  <th className="text-left text-sm font-medium text-slate-600 px-4 py-3">Upload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(settlement?.checklist || []).map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-slate-900">{item.task}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.responsible}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.dueDate}</td>
                    <td className="px-4 py-3">
                      <button className="flex items-center space-x-1">
                        {item.completed ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-slate-400">○</span>
                        )}
                        <span className="text-sm text-slate-600">{item.status}</span>
                        <span>▼</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-sm text-slate-600 hover:text-slate-900">📤</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 p-4">
            <h3 className="text-lg font-semibold text-slate-900">Settlement Thread</h3>
          </div>
          
          {settlement?.warning && (
            <div className="bg-amber-50 border-b border-amber-200 p-3">
              <div className="flex items-center space-x-2">
                <span className="text-amber-600">⚠️</span>
                <p className="text-sm text-amber-900">{settlement.warning}</p>
              </div>
            </div>
          )}

          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {msg.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-slate-900">{msg.sender}</span>
                    {msg.role && <span className="text-xs text-slate-500">{msg.role}</span>}
                  </div>
                  <p className="text-sm text-slate-700 mt-1">{msg.message}</p>
                  <span className="text-xs text-slate-500">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded"
              >
                <span>➤</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Outstanding Items</h3>
          <div className="space-y-4">
            {(settlement?.outstandingItems || []).map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 border-2 rounded-full mt-0.5 ${
                  item.overdue ? 'border-red-500' : 'border-amber-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.category}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{item.title}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.overdue && (
                        <button className="text-xs text-red-600 hover:text-red-700">Overdue</button>
                      )}
                      {item.dueSoon && (
                        <button className="text-xs text-amber-600">{item.dueSoon}</button>
                      )}
                      {item.awaitingApproval && (
                        <button className="text-sm text-indigo-600 hover:text-indigo-700">Approve</button>
                      )}
                      <button className="text-xs text-slate-600">▼</button>
                      <button className="text-sm text-slate-600 hover:text-slate-900">📤</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Settlement Timeline</h3>
          <div className="space-y-4">
            {(settlement?.timeline || []).map((milestone) => (
              <div key={milestone.id} className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  getTimelineStatusClass(milestone.status)
                }`}>
                  {milestone.status === 'complete' ? '✓' : milestone.status === 'pending' ? '⏱' : '○'}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{milestone.milestone}</p>
                  <p className="text-xs text-slate-500">
                    {milestone.status === 'pending' ? 'Estimated: ' : ''}{milestone.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {settlement?.requiredDocuments && settlement.requiredDocuments.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Required Settlement Documents</h3>
          <div className="grid grid-cols-5 gap-4">
            {settlement.requiredDocuments.map((doc, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-lg">📄</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{doc.title}</p>
                  <p className="text-xs text-slate-500 mt-1">Responsible: {doc.responsible}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded mt-2 ${
                    getStatusBadgeClass(doc.status)
                  }`}>
                    {doc.status}
                  </span>
                  <div className="flex items-center space-x-2 mt-3">
                    <button className={`text-xs ${doc.status === 'Complete' ? 'text-indigo-600 hover:text-indigo-700' : 'text-slate-400'}`}>
                      👁️ View
                    </button>
                    <button className={`text-xs ${doc.status === 'Complete' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400'}`}>
                      📥 Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
