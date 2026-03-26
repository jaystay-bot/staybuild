'use client'

export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
      }}
    >
      <div style={{ maxWidth: '640px', width: '100%', textAlign: 'center' }}>
        {/* Available badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px',
            padding: '6px 16px',
            marginBottom: '40px',
            fontSize: '13px',
            color: '#999',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'inline-block',
              animation: 'pulse 2s infinite',
            }}
          />
          Available for new projects
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(38px, 8vw, 58px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: '#f0efe8',
            marginBottom: '24px',
          }}
        >
          You have the idea.<br />
          I&apos;ll build the product.
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: '18px',
            color: '#777',
            marginBottom: '48px',
            lineHeight: 1.65,
          }}
        >
          Web apps, landing pages, and PWAs — built clean, built fast. Starting at $600.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '64px',
          }}
        >
          <a
            href="#intake"
            style={{
              backgroundColor: '#7c3aed',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '16px',
              textDecoration: 'none',
              minHeight: '48px',
              display: 'inline-flex',
              alignItems: 'center',
              boxShadow: '0 0 24px rgba(124,58,237,0.35)',
              transition: 'opacity 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.boxShadow = '0 0 32px rgba(124,58,237,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 0 24px rgba(124,58,237,0.35)' }}
          >
            Start a Project →
          </a>
          <a
            href="#portfolio"
            style={{
              backgroundColor: 'transparent',
              color: '#aaa',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'none',
              minHeight: '48px',
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#f0efe8' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#aaa' }}
          >
            See My Work
          </a>
        </div>

        {/* Trust stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '40px',
          }}
        >
          {[
            { value: '$600', label: 'Starting price' },
            { value: '$0/mo', label: 'Client hosting cost' },
            { value: '5+', label: 'Live products built' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#f0efe8', letterSpacing: '-0.03em' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '6px', letterSpacing: '0.02em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  )
}
