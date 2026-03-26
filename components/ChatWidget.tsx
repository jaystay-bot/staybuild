'use client'

import { useState, useRef, useEffect } from 'react'
import StaybuildLogo from '@/components/StaybuildLogo'

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
  content: "Hey 👋 I'm Jay's assistant. What are you looking to build?",
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      if (getUsageCount() >= DAILY_LIMIT) setRateLimited(true)
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
            content: "You've hit the daily message limit. Come back tomorrow — or fill out the intake form and Jay will get back to you directly!",
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
            content: "Something went wrong on my end. Head to the intake form below and Jay will get back to you within 24 hours!",
          },
        ])
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Something went wrong. Try the intake form below to reach Jay directly!",
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
            background: '#0f1117',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: '20px',
            boxShadow: '0 28px 72px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.1), 0 0 40px rgba(124,58,237,0.06)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden',
            animation: 'chatSlideUp 0.2s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              padding: '16px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.08) 100%)',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {/* Avatar — Staybuild crystal logo */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(124,58,237,0.12)',
                boxShadow: '0 0 16px rgba(124,58,237,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <StaybuildLogo size={24} />
              {/* Glowing online dot */}
              <span
                style={{
                  position: 'absolute',
                  bottom: '1px',
                  right: '1px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#a78bfa',
                  border: '2px solid #0f1117',
                  boxShadow: '0 0 6px rgba(167,139,250,0.8)',
                  animation: 'onlinePulse 2.5s ease-in-out infinite',
                }}
              />
            </div>

            {/* Name + status */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f0efe8', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                Jay
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#a78bfa',
                    boxShadow: '0 0 6px rgba(167,139,250,0.9)',
                    display: 'inline-block',
                    animation: 'onlinePulse 2.5s ease-in-out infinite',
                  }}
                />
                <span style={{ fontSize: '11px', color: '#6d6a80' }}>Online now</span>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#4a4762',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#aaa'
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#4a4762'
                e.currentTarget.style.background = 'none'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── Messages ── */}
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
                  animation: 'msgFadeIn 0.18s ease-out',
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
                    lineHeight: 1.58,
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                        : 'rgba(255,255,255,0.05)',
                    color: msg.role === 'user' ? '#fff' : '#c8c7c0',
                    border:
                      msg.role === 'user'
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.08)',
                    boxShadow:
                      msg.role === 'user'
                        ? '0 2px 12px rgba(124,58,237,0.3)'
                        : 'none',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', animation: 'msgFadeIn 0.18s ease-out' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '14px 14px 14px 3px',
                    background: 'rgba(255,255,255,0.05)',
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
                        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
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

          {/* ── Input area ── */}
          <div
            style={{
              padding: '12px 14px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.3)',
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
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '10px',
                padding: '9px 13px',
                fontSize: '13.5px',
                color: '#f0efe8',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                opacity: rateLimited ? 0.45 : 1,
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.08)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!canSend}
              aria-label="Send message"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: canSend
                  ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                  : 'rgba(124,58,237,0.2)',
                border: 'none',
                cursor: canSend ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'opacity 0.15s, transform 0.1s, box-shadow 0.15s',
                boxShadow: canSend ? '0 2px 10px rgba(124,58,237,0.35)' : 'none',
              }}
              onMouseEnter={e => {
                if (canSend) {
                  e.currentTarget.style.transform = 'scale(1.08)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.5)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = canSend ? '0 2px 10px rgba(124,58,237,0.35)' : 'none'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating bubble + pulse ring ───────────────────────── */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10000,
          width: '52px',
          height: '52px',
        }}
      >
        {/* Outer pulse ring — only when closed */}
        {!open && (
          <span
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              border: '2px solid rgba(124,58,237,0.45)',
              animation: 'bubblePulse 2.8s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}
        {/* Second ring — offset phase */}
        {!open && (
          <span
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              border: '2px solid rgba(79,70,229,0.3)',
              animation: 'bubblePulse 2.8s ease-out infinite',
              animationDelay: '1.4s',
              pointerEvents: 'none',
            }}
          />
        )}

        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close chat' : 'Chat with Jay'}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.15s',
            position: 'relative',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <StaybuildLogo size={52} />

          {/* Green availability dot */}
          {!open && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #0d0f12',
                boxShadow: '0 0 6px rgba(34,197,94,0.6)',
              }}
            />
          )}
        </button>
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(14px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes bubblePulse {
          0%   { transform: scale(1);    opacity: 0.7; }
          70%  { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes onlinePulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.45; }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
