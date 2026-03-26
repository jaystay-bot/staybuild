'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const DAILY_LIMIT = 20
const STORAGE_KEY = 'sb_chat_usage'

function getUsageCount(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      const today = new Date().toISOString().slice(0, 10)
      if (parsed.date === today) return parsed.count
    }
  } catch {}
  return 0
}

function incrementUsage(): void {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const current = getUsageCount()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: current + 1, date: today }))
  } catch {}
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi! I'm the Staybuild assistant. Ask me anything about pricing, timelines, or what we can build for you! 👋",
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      const count = getUsageCount()
      if (count >= DAILY_LIMIT) setRateLimited(true)
    }
  }, [open])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading || rateLimited) return

    if (getUsageCount() >= DAILY_LIMIT) {
      setRateLimited(true)
      return
    }

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()

      if (res.status === 429 || data.error === 'rate_limited') {
        setRateLimited(true)
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content:
              "You've hit the daily message limit. Come back tomorrow — or just fill out the intake form and Jay will get back to you directly!",
          },
        ])
      } else if (data.success && data.reply) {
        incrementUsage()
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content:
              "Something went wrong on my end. Head to the intake form below and Jay will get back to you within 24 hours!",
          },
        ])
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Something went wrong. Try the intake form below to reach Jay directly!",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const canSend = input.trim().length > 0 && !loading && !rateLimited

  return (
    <>
      {/* ── Chat panel ─────────────────────────────────────────── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '92px',
            right: '24px',
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(520px, calc(100svh - 120px))',
            background: '#13151a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(124,58,237,0.12)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden',
            animation: 'chatSlideUp 0.18s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(124,58,237,0.07)',
              flexShrink: 0,
            }}
          >
            {/* Bot avatar */}
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(124,58,237,0.2)',
                border: '1px solid rgba(124,58,237,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#f0efe8', lineHeight: 1.2 }}>
                Staybuild Assistant
              </div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                Powered by Claude
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#555',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#aaa'
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#555'
                e.currentTarget.style.background = 'none'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '10px 13px',
                    borderRadius:
                      msg.role === 'user'
                        ? '14px 14px 3px 14px'
                        : '14px 14px 14px 3px',
                    fontSize: '13.5px',
                    lineHeight: 1.55,
                    background:
                      msg.role === 'user'
                        ? '#7c3aed'
                        : 'rgba(255,255,255,0.06)',
                    color: msg.role === 'user' ? '#fff' : '#cccbc4',
                    border:
                      msg.role === 'user'
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '14px 14px 14px 3px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#7c3aed',
                        display: 'inline-block',
                        animation: 'typingDot 1.2s infinite ease-in-out',
                        animationDelay: `${i * 0.18}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            style={{
              padding: '10px 12px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.25)',
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || rateLimited}
              placeholder={rateLimited ? 'Daily limit reached' : 'Ask about pricing, timeline...'}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '9px 12px',
                fontSize: '13.5px',
                color: '#f0efe8',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s',
                opacity: rateLimited ? 0.45 : 1,
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            />
            <button
              onClick={sendMessage}
              disabled={!canSend}
              aria-label="Send message"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: canSend ? '#7c3aed' : 'rgba(124,58,237,0.25)',
                border: 'none',
                cursor: canSend ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s, transform 0.1s',
              }}
              onMouseEnter={e => { if (canSend) e.currentTarget.style.transform = 'scale(1.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating bubble ────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Chat with Staybuild assistant'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#7c3aed',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
          zIndex: 10000,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,58,237,0.65)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.5)'
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}

        {/* Green online dot — only when closed */}
        {!open && (
          <span
            style={{
              position: 'absolute',
              top: '3px',
              right: '3px',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #0d0f12',
            }}
          />
        )}
      </button>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </>
  )
}
