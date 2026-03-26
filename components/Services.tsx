'use client'

const services = [
  {
    label: 'Most Popular',
    labelColor: '#7c3aed',
    title: 'Landing Page',
    price: '$600',
    description:
      'Clean, mobile-first site that loads fast and converts visitors. Perfect for local businesses, menus, portfolios, and service pages.',
    includes: ['Custom design', 'Mobile optimized', 'Contact form', 'Deployed & live'],
    cta: 'Get Started →',
  },
  {
    label: 'Most Complex',
    labelColor: '#888',
    title: 'Web App',
    price: '$600–$2,000+',
    description:
      'Full-stack apps with user auth, payments, APIs, and databases. Like GroomerOS, EdgeCheck, or CardProfit — real products that do real things.',
    includes: ['Full-stack build', 'API integrations', 'Auth + payments', 'Supabase database'],
    cta: 'Get Started →',
  },
  {
    label: 'Add-on',
    labelColor: '#f59e0b',
    title: 'PWA Add-on',
    price: '+$150',
    description:
      'Turn any site into an installable app. Users add it to their home screen — no App Store needed. Works on iOS and Android.',
    includes: ['App manifest', 'Offline support', 'Home screen install', 'App-like experience'],
    cta: 'Add to Any Build →',
  },
]

export default function Services() {
  return (
    <section style={{ padding: '80px 24px' }}>
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
          What I Build
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {services.map((s) => (
            <div
              key={s.title}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)' }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: s.labelColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {s.label}
              </span>

              <div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#f0efe8', letterSpacing: '-0.02em' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#7c3aed', marginTop: '6px' }}>
                  {s.price}
                </div>
              </div>

              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6 }}>{s.description}</p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {s.includes.map((item) => (
                  <li key={item} style={{ fontSize: '13px', color: '#f0efe8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#7c3aed', fontWeight: 700 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#intake"
                style={{
                  marginTop: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: '#7c3aed',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                  paddingTop: '8px',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {s.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Maintenance strip */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '14px',
            color: '#888',
          }}
        >
          🔧 <strong style={{ color: '#f0efe8' }}>Monthly Maintenance — $75/month.</strong> Keeps your site live, updated, and handled. You focus on your business.
        </div>
      </div>
    </section>
  )
}
