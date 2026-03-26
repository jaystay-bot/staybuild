'use client'

const projects = [
  {
    tag: 'Web App',
    title: 'GroomerOS',
    description: 'Dog grooming business management tool. Tracks appointments, breeds, and groomer pay.',
    href: 'https://groomeros.vercel.app',
    accentColor: '#22c55e',
  },
  {
    tag: 'Web App',
    title: 'EdgeCheck',
    description: 'Sports bet analyzer. Instant verdict engine with odds analysis and affiliate monetization.',
    href: 'https://edgecheck.app',
    accentColor: '#7c3aed',
  },
  {
    tag: 'Web App',
    title: 'CardProfit',
    description: 'Credit card cashback recommender. Tells you exactly which card to use per store.',
    href: 'https://cardprofit.vercel.app',
    accentColor: '#f59e0b',
  },
  {
    tag: 'Web App',
    title: 'Sim2Round',
    description: 'Golf simulator companion app. Built for tracking rounds and improving game.',
    href: 'https://sim2round.com',
    accentColor: '#3b82f6',
  },
  {
    tag: 'Web App',
    title: 'CalcPath',
    description: 'Free financial calculators with instant results. Mortgage affordability, loan payoff, freelance rates, and tax estimates.',
    href: 'https://calcpath.vercel.app',
    accentColor: '#3b82f6',
  },
]

export default function Portfolio() {
  return (
    <section id="portfolio" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#f0efe8',
            marginBottom: '8px',
          }}
        >
          Live Work
        </h2>
        <p style={{ fontSize: '16px', color: '#888', marginBottom: '40px' }}>
          Real products I built — not mockups.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {projects.map((p) => (
            <div
              key={p.title}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                transition: 'transform 0.22s, box-shadow 0.25s, border-color 0.25s, background 0.22s',
                cursor: 'default',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'scale(1.02)'; el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 18px ${p.accentColor}22`; el.style.borderColor = `${p.accentColor}55`; el.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'scale(1)'; el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.background = 'rgba(255,255,255,0.04)' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: p.accentColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  backgroundColor: `${p.accentColor}18`,
                  padding: '3px 10px',
                  borderRadius: '100px',
                  alignSelf: 'flex-start',
                }}
              >
                {p.tag}
              </span>

              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f0efe8', letterSpacing: '-0.02em' }}>
                {p.title}
              </div>

              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6, flex: 1 }}>
                {p.description}
              </p>

              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  color: p.accentColor,
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Live →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
