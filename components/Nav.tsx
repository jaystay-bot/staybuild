'use client'

export default function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(13,15,18,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7c3aed', display: 'inline-block' }} />
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#f0efe8', letterSpacing: '-0.02em' }}>
            Staybuild
          </span>
        </div>

        <a
          href="#intake"
          style={{
            backgroundColor: '#7c3aed',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Get a Quote
        </a>
      </div>
    </nav>
  )
}
