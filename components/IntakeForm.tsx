'use client'

import { useState, useRef, useEffect } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  padding: '13px 16px',
  fontSize: '15px',
  color: '#f0efe8',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 400,
  color: '#b0afa8',
  marginBottom: '8px',
  letterSpacing: '0.01em',
}

// ── Custom Select ────────────────────────────────────────────
interface SelectOption { value: string; label: string }

function CustomSelect({
  name,
  value,
  required,
  options,
  onChange,
}: {
  name: string
  value: string
  required?: boolean
  options: SelectOption[]
  onChange: (name: string, value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      {/* Hidden native input for required validation */}
      {required && (
        <input
          type="text"
          required
          value={value}
          onChange={() => {}}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
          tabIndex={-1}
        />
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          ...inputStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          color: selected ? '#f0efe8' : 'rgba(240,239,232,0.28)',
          textAlign: 'left',
          borderColor: open ? 'rgba(124,58,237,0.65)' : 'rgba(255,255,255,0.12)',
          boxShadow: open ? '0 0 0 3px rgba(124,58,237,0.12)' : 'none',
        }}
      >
        <span>{selected ? selected.label : 'Select one...'}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{
            flexShrink: 0,
            marginLeft: '8px',
            transition: 'transform 0.15s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: '#888',
          }}
        >
          <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            backgroundColor: '#1a1d23',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
            zIndex: 50,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {options.map(option => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(name, option.value)
                  setOpen(false)
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '11px 16px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: isSelected ? 'rgba(124,58,237,0.18)' : 'transparent',
                  color: isSelected ? '#c4b5fd' : '#f0efe8',
                  display: 'block',
                  transition: 'background-color 0.1s',
                }}
                onMouseEnter={e => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(124,58,237,0.1)'
                }}
                onMouseLeave={e => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
// ────────────────────────────────────────────────────────────

export default function IntakeForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({
    idea: '',
    serviceType: '',
    needsAuth: '',
    hasBranding: '',
    inspiration: '',
    timeline: '',
    budget: '',
    name: '',
    email: '',
    phone: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSelectChange(name: string, value: string) {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormState('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setFormState('success')
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  if (formState === 'success') {
    return (
      <section id="intake" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '12px',
              padding: '48px 32px',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>✓</div>
            <p style={{ fontSize: '20px', fontWeight: 600, color: '#f0efe8' }}>
              Got it. I&apos;ll be in touch within 24 hours.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="intake"
      style={{
        padding: '80px 24px',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(124,58,237,0.07) 0%, transparent 65%)',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '40px 36px',
          boxShadow: '0 8px 48px rgba(0,0,0,0.45)',
        }}
      >
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#f0efe8',
            marginBottom: '10px',
          }}
        >
          Start a Project
        </h2>
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '36px', lineHeight: 1.6 }}>
          Tell me what you need. I&apos;ll get back to you within 24 hours.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* 1. Business/idea */}
          <div>
            <label style={labelStyle}>What&apos;s your business or idea? *</label>
            <textarea
              name="idea"
              required
              rows={4}
              value={form.idea}
              onChange={handleChange}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="Describe what you do and what you want built..."
            />
          </div>

          {/* 2. Service type */}
          <div>
            <label style={labelStyle}>What do you need built? *</label>
            <CustomSelect
              name="serviceType"
              value={form.serviceType}
              required
              onChange={handleSelectChange}
              options={[
                { value: 'Landing Page', label: 'Landing Page' },
                { value: 'Web App', label: 'Web App' },
                { value: 'PWA Add-on (+$200)', label: 'PWA Add-on (+$200)' },
                { value: 'Not sure yet', label: 'Not sure yet' },
              ]}
            />
          </div>

          {/* 3. Auth/payments */}
          <div>
            <label style={labelStyle}>Do users need to log in or pay on the site? *</label>
            <CustomSelect
              name="needsAuth"
              value={form.needsAuth}
              required
              onChange={handleSelectChange}
              options={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
                { value: 'Not sure', label: 'Not sure' },
              ]}
            />
          </div>

          {/* 4. Branding */}
          <div>
            <label style={labelStyle}>Do you have a logo or brand colors? *</label>
            <CustomSelect
              name="hasBranding"
              value={form.hasBranding}
              required
              onChange={handleSelectChange}
              options={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
                { value: 'Need help with that too', label: 'Need help with that too' },
              ]}
            />
          </div>

          {/* 5. Inspiration */}
          <div>
            <label style={labelStyle}>
              Any sites or apps you love the look of?{' '}
              <span style={{ color: '#888' }}>(optional)</span>
            </label>
            <input
              type="text"
              name="inspiration"
              value={form.inspiration}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g. linear.app, stripe.com"
            />
          </div>

          {/* 6. Timeline */}
          <div>
            <label style={labelStyle}>What&apos;s your timeline? *</label>
            <CustomSelect
              name="timeline"
              value={form.timeline}
              required
              onChange={handleSelectChange}
              options={[
                { value: 'ASAP', label: 'ASAP' },
                { value: '2–4 weeks', label: '2–4 weeks' },
                { value: 'No rush', label: 'No rush' },
              ]}
            />
          </div>

          {/* 7. Budget */}
          <div>
            <label style={labelStyle}>What&apos;s your budget range? *</label>
            <CustomSelect
              name="budget"
              value={form.budget}
              required
              onChange={handleSelectChange}
              options={[
                { value: '$600–$1,000', label: '$600–$1,000' },
                { value: '$1,000–$2,000', label: '$1,000–$2,000' },
                { value: '$2,000+', label: '$2,000+' },
                { value: "Let's talk", label: "Let's talk" },
              ]}
            />
          </div>

          {/* 8. Name */}
          <div>
            <label style={labelStyle}>Your name *</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Jay Smith"
            />
          </div>

          {/* 9. Email */}
          <div>
            <label style={labelStyle}>Best email to reach you *</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>

          {/* 10. Phone */}
          <div>
            <label style={labelStyle}>
              Phone number <span style={{ color: '#888' }}>(optional)</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={inputStyle}
              placeholder="(555) 000-0000"
            />
          </div>

          {formState === 'error' && (
            <p style={{ fontSize: '14px', color: '#f87171' }}>
              Something went wrong. Email me directly at{' '}
              <a href="mailto:jay@staybuild.dev" style={{ color: '#f87171' }}>
                jay@staybuild.dev
              </a>
            </p>
          )}

          <button
            type="submit"
            disabled={formState === 'loading'}
            style={{
              width: '100%',
              backgroundColor: formState === 'loading' ? 'rgba(124,58,237,0.5)' : '#7c3aed',
              color: '#fff',
              padding: '15px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '16px',
              border: 'none',
              minHeight: '52px',
              cursor: formState === 'loading' ? 'not-allowed' : 'pointer',
              boxShadow: formState === 'loading' ? 'none' : '0 0 24px rgba(124,58,237,0.35)',
              transition: 'opacity 0.15s, box-shadow 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              if (formState !== 'loading') {
                const b = e.currentTarget as HTMLButtonElement
                b.style.opacity = '0.9'
                b.style.boxShadow = '0 0 32px rgba(124,58,237,0.5)'
              }
            }}
            onMouseLeave={e => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.opacity = '1'
              b.style.boxShadow = '0 0 24px rgba(124,58,237,0.35)'
            }}
          >
            {formState === 'loading' ? 'Sending...' : 'Send My Project Details →'}
          </button>
        </form>
      </div>
    </section>
  )
}
