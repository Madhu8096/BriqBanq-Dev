import { useState } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { borrowerApi } from '../../api'

export default function MessagesTab({ caseId, messages: initialMessages = [] }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(null)

  const handleSendMessage = async () => {
    const body = newMessage.trim()
    if (!body) return
    setSendError(null)
    const optimistic = {
      id: `opt-${Date.now()}`,
      sender: user?.name || 'You',
      initials: user?.initials || 'U',
      message: body,
      timestamp: 'Sending…',
      isBorrower: true,
    }
    setMessages((prev) => [...prev, optimistic])
    setNewMessage('')
    setSending(true)
    try {
      if (caseId) {
        await borrowerApi.sendCaseMessage(caseId, { message: body })
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...m, timestamp: 'Just now' } : m))
      )
    } catch (err) {
      setSendError(err?.response?.data?.message || err?.message || 'Failed to send. You can try again.')
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
      setNewMessage(body)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-lg border border-gray-200 min-h-[500px]">
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">Case Messages</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg) => {
            const isBorrower = msg.isBorrower ?? msg.isUser
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBorrower ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                    isBorrower ? 'bg-gray-300 text-gray-700' : 'bg-blue-600 text-white'
                  }`}
                >
                  {msg.initials ?? msg.avatar ?? '?'}
                </div>
                <div className={`flex-1 max-w-[80%] ${isBorrower ? '' : 'text-right'}`}>
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-sm font-medium text-gray-900">{msg.sender}</span>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`mt-1 px-3 py-2 rounded-lg text-sm ${
                      isBorrower
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-600 text-white inline-block'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
      <div className="border-t border-gray-200 p-4">
        {sendError && (
          <p className="text-sm text-red-600 mb-2" role="alert">
            {sendError}
          </p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={sending}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={sending}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50"
            aria-label="Send message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
