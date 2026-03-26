'use client'

export default function AboutJay() {
  return (
    <section id="about" style={{ padding: '80px 24px' }}>
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
          Who&apos;s building your product?
        </h2>

        <div
          style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          {/* Photo placeholder */}
          <div
            style={{
              width: '96px',
              height: '96px',
              minWidth: '96px',
              borderRadius: '16px',
              background: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 800,
              color: '#7c3aed',
              letterSpacing: '-0.02em',
            }}
          >
            J
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <p
              style={{
                fontSize: '15px',
                color: '#999',
                lineHeight: 1.75,
                marginBottom: '20px',
              }}
            >
              I&apos;m Jay, a self-taught developer from Colonial Heights, Virginia. Every project in my portfolio
              I built myself — from the ground up. I work fast, communicate clearly, and I won&apos;t disappear on you
              mid-project. When you work with Staybuild you work directly with me — not an agency, not a contractor.
              Just someone who genuinely cares about what we build together.
            </p>

            <p
              style={{
                fontSize: '13px',
                color: '#555',
                fontStyle: 'italic',
              }}
            >
              <span style={{ color: '#7c3aed' }}>—</span> Jay, founder of Staybuild
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
