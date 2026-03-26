'use client'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '40px 24px 80px',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#f0efe8' }}>Staybuild</div>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Built by Jay</div>
          <div style={{ fontSize: '12px', color: '#555', marginTop: '6px' }}>Response time: within 24 hours</div>
        </div>

        <a
          href="mailto:jonathanstaley17@gmail.com"
          style={{ fontSize: '14px', color: '#888', textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f0efe8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#888')}
        >
          jonathanstaley17@gmail.com
        </a>

        <div style={{ fontSize: '13px', color: '#555' }}>© 2025 Staybuild</div>
      </div>
    </footer>
  )
}
