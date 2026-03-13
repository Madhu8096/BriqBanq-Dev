// src/pages/admin/case-details/Messages.jsx
import { useState, useRef, useEffect } from 'react'
import { useCaseContext } from '../../../context/CaseContext'
import { Send, Image as ImageIcon, Paperclip, MoreHorizontal, Search, ShieldCheck, Zap, Command, Smile, Mic } from 'lucide-react'

export default function Messages() {
    const { caseData } = useCaseContext()
    const [messages, setMessages] = useState(caseData.messages)
    const [inputValue, setInputValue] = useState('')
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSendMessage = () => {
        if (!inputValue.trim()) return

        const newMessage = {
            id: Date.now(),
            sender: 'David Williams',
            role: 'Administrator',
            message: inputValue,
            timestamp: 'Just now',
            avatar: 'DW',
            isAdmin: true
        }

        setMessages([...messages, newMessage])
        setInputValue('')
    }

    return (
        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden flex flex-col h-[750px] relative">
            {/* Visual Flare */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-50" />

            {/* Chat Header */}
            <div className="p-4 sm:p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-20 gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white text-lg font-black shadow-lg">
                            <Zap className="w-6 h-6 text-indigo-400 fill-indigo-400" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-lg" />
                    </div>
                    <div className="space-y-0.5">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">Case Messages</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-emerald-600 font-black uppercase tracking-[0.2em] bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1.5 border border-emerald-100/50">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                Encrypted
                            </span>
                            <div className="w-1 h-1 rounded-full bg-gray-200" />
                            <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">04 Members present</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:flex-none">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Locate message..."
                            className="w-full md:w-56 pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 focus:bg-white focus:outline-none transition-all"
                        />
                    </div>
                    <button className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-indigo-600 transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Expansive Message Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth bg-gradient-to-b from-white to-gray-50/20"
            >
                <div className="flex flex-col items-center gap-4">
                    <span className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.4em] shadow-md">
                        Operational Log • {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </span>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-gray-200 to-transparent" />
                </div>

                {messages.map((msg, index) => (
                    <div
                        key={msg.id}
                        className={`flex gap-6 ${msg.isAdmin ? 'flex-row-reverse' : ''}`}
                    >
                        {/* Avatar Architecture */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] flex-shrink-0 shadow-sm
                                ${msg.isAdmin ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white border border-gray-100 text-gray-900 shadow-gray-100'}
                            `}>
                            {msg.avatar}
                        </div>

                        {/* Bubble Construction */}
                        <div className={`max-w-[70%] space-y-4 ${msg.isAdmin ? 'text-right' : ''}`}>
                            <div className={`flex items-center gap-4 ${msg.isAdmin ? 'flex-row-reverse text-right' : ''}`}>
                                <span className="text-xs font-black text-gray-900 uppercase tracking-widest leading-none">{msg.sender}</span>
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                    {msg.role}
                                </span>
                            </div>

                            <div className={`px-8 py-5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm relative group cursor-text
                                    ${msg.isAdmin
                                    ? 'bg-gray-900 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}
                                `}>
                                {msg.message}
                            </div>

                            <div className={`flex items-center gap-3 mt-4 ${msg.isAdmin ? 'flex-row-reverse' : ''}`}>
                                <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">{msg.timestamp}</p>
                                <div className="w-1 h-1 rounded-full bg-gray-200" />
                                <button className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors">Decrypt Transcript</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Hub */}
            <div className="p-4 sm:p-6 bg-white border-t border-gray-50 sticky bottom-0 z-20">
                <div className="max-w-3xl mx-auto space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1.5 text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                                <Smile className="w-3.5 h-3.5" /> Symbols
                            </button>
                        </div>
                        <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.4em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Secure Trace Active
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
                            <button className="p-3 bg-gray-50/50 hover:bg-indigo-50 text-gray-400 rounded-lg transition-all">
                                <Paperclip className="w-4 h-4" />
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="w-full pl-16 pr-16 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-[13px] font-medium placeholder:text-gray-300 focus:bg-white focus:outline-none transition-all shadow-inner"
                        />

                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <button
                                onClick={handleSendMessage}
                                className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg flex items-center justify-center"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
