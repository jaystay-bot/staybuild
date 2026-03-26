'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'How long does it take?',
    a: 'Most landing pages are done in 5–7 days. Web apps take 1–3 weeks depending on complexity. I\'ll give you an exact timeline before we start.',
  },
  {
    q: 'How does payment work?',
    a: '50% deposit to begin, 50% when the project is live and you\'re happy with it. I send a secure Stripe payment link — no awkward cash exchanges.',
  },
  {
    q: 'What if I need changes after launch?',
    a: 'Minor tweaks are included for 2 weeks after launch. For ongoing changes, the $75/month maintenance plan has you covered.',
  },
  {
    q: 'Do I own the site when it\'s done?',
    a: '100% yes. The code, the domain, everything is yours. I just build it.',
  },
  {
    q: 'What do I need to provide to get started?',
    a: 'Just your idea and any branding you have. No tech knowledge needed — that\'s my job.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="faq" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#f0efe8',
            marginBottom: '40px',
          }}
        >
          Common Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid',
                borderColor: open === i
                  ? 'rgba(124,58,237,0.45)'
                  : hovered === i
                  ? 'rgba(255,255,255,0.14)'
                  : 'rgba(255,255,255,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: open === i ? '0 0 0 1px rgba(124,58,237,0.08), 0 4px 20px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: '100%',
                  background: hovered === i && open !== i ? 'rgba(255,255,255,0.025)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: open === i ? '#7c3aed' : '#f0efe8',
                    transition: 'color 0.15s',
                    lineHeight: 1.4,
                  }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    fontSize: '18px',
                    color: open === i ? '#7c3aed' : '#555',
                    flexShrink: 0,
                    transition: 'transform 0.2s, color 0.15s',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    display: 'inline-block',
                  }}
                >
                  +
                </span>
              </button>

              {open === i && (
                <div
                  style={{
                    padding: '0 24px 20px',
                    fontSize: '14px',
                    color: '#888',
                    lineHeight: 1.7,
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
