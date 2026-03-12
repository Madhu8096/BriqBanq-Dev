import { useState } from 'react'

export default function MessagesTab({ messages: initialMessages = [], caseId }) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    const message = {
      id: messages.length + 1,
      sender: 'You',
      avatar: 'U',
      message: newMessage,
      timestamp: 'Just now',
      isUser: true
    }
    
    setMessages([...messages, message])
    setNewMessage('')
  }

  return (
    <div className="h-[600px] flex flex-col bg-white rounded-lg border border-slate-200">
      <div className="border-b border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Case Messages</h3>
      </div>

      <div className="bg-indigo-50 border-b border-indigo-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-full"></div>
            <p className="text-sm text-indigo-900">David Williams</p>
          </div>
          <p className="text-sm text-indigo-700">Could you also provide the most recent property...</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {msg.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-900">{msg.sender}</span>
                  <span className="text-xs text-slate-500">{msg.timestamp}</span>
                </div>
                <p className="text-sm text-slate-700 mt-1">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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
  )
}
