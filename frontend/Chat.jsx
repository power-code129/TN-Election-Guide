import { useState, useRef, useEffect } from 'react'
import { api } from '../hooks/useApi'

const SUGGESTED = [
  'How do I register as a voter for free?',
  'How to download free e-EPIC / Voter ID?',
  'How does EVM voting work?',
  'What is VVPAT?',
  'How to check my name in voter list free?',
  'What is Model Code of Conduct?',
  'How are votes counted in India?',
  'Difference between Lok Sabha and TN Assembly?',
  'What is NOTA?',
  'What free apps does ECI provide?',
]

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  text: '👋 நமஸ்காரம்! Hello!\n\nI\'m your Tamil Nadu & India Election Guide AI — powered by the free Google Gemini API.\n\nAsk me anything about:\n• Free voter registration (Form 6 / e-EPIC)\n• EVM and VVPAT voting process\n• Lok Sabha, TN Assembly, Panchayat elections\n• Model Code of Conduct\n• Free ECI apps (cVIGIL, Voter Helpline, Saksham)\n• Vote counting & results\n\nAll services mentioned are FREE for every citizen! 🗳️',
}

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    setError('')
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: msg }])
    setLoading(true)
    try {
      const data = await api.chat(msg)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.reply,
        source: data.source,
      }])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <section id="chat" className="py-20 bg-slate-50 dark:bg-slate-950" aria-labelledby="chat-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            ✨ FREE Google Gemini AI
          </div>
          <h2 id="chat-heading" className="section-title">
            Ask the <span className="text-navy-700 dark:text-navy-400">Election Guide AI</span>
          </h2>
          <p className="section-subtitle">
            Powered by Google Gemini free tier — 1,500 free requests/day via AI Studio
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

          {/* Header */}
          <div className="bg-navy-800 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl flex-shrink-0" aria-hidden="true">🗳️</div>
            <div>
              <div className="text-white font-bold text-sm">TN Election Guide AI</div>
              <div className="text-white/60 text-xs">Gemini free tier • ECI Knowledge Base • Tamil Nadu Elections</div>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
              <span className="text-white/60 text-xs">Free &amp; Online</span>
            </div>
          </div>

          {/* Messages */}
          <div
            className="h-96 overflow-y-auto p-6 space-y-4 scroll-smooth"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 bg-navy-100 dark:bg-navy-800 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1" aria-hidden="true">🤖</div>
                )}
                <div className={`relative max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  m.role === 'user'
                    ? 'bg-navy-800 text-white rounded-br-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm'
                }`}>
                  {m.text}
                  {m.source && (
                    <span className={`block mt-2 text-xs ${m.role === 'user' ? 'text-white/50' : 'text-slate-400'}`}>
                      {m.source === 'gemini-free' ? '✨ Google Gemini (free tier)' : '📚 ECI Knowledge Base (offline)'}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start" aria-live="polite" aria-label="AI is typing">
                <div className="w-8 h-8 bg-navy-100 dark:bg-navy-800 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1" aria-hidden="true">🤖</div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center" role="alert">
                <span className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg inline-block">⚠️ {error}</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          <div className="px-6 pb-3">
            <p className="text-xs text-slate-400 mb-2 font-medium">💡 Try asking:</p>
            <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Suggested questions">
              {SUGGESTED.slice(0, 5).map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  disabled={loading}
                  className="flex-shrink-0 text-xs px-3 py-1.5 bg-navy-50 dark:bg-navy-900/40 text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-700 rounded-full hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4">
            <div className="flex gap-3 items-end">
              <label htmlFor="chat-input" className="sr-only">Type your election question</label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about voter registration, EVM, Tamil Nadu elections..."
                rows={1}
                maxLength={500}
                disabled={loading}
                className="flex-1 resize-none rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent disabled:opacity-50 transition-colors"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="btn-primary py-3 px-5 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">{input.length}/500</p>
          </div>
        </div>

        {/* Gemini free tier note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span aria-hidden="true">✨</span>
          <span>Powered by <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">Google Gemini free tier</a> — 1,500 free requests/day. No billing required.  NOTE-API may run in demo mode due to deployment limitations</span>
        </div>
      </div>
    </section>
  )
}
