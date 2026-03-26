const steps = [
  {
    number: '01',
    title: 'Tell me your idea',
    description: 'Fill out the intake form. No calls needed to get started.',
  },
  {
    number: '02',
    title: 'I scope it out',
    description: 'I review your form and send back a clear price and timeline. No surprises.',
  },
  {
    number: '03',
    title: 'You approve',
    description: "Once you're happy with the scope, a 50% deposit locks in your spot.",
  },
  {
    number: '04',
    title: 'We build and ship',
    description: 'I build it, you review it, we launch it. Remaining 50% on delivery.',
  },
]

export default function HowItWorks() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#f0efe8',
            marginBottom: '48px',
          }}
        >
          How It Works
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  fontSize: '40px',
                  fontWeight: 800,
                  color: '#7c3aed',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  minWidth: '52px',
                }}
              >
                {step.number}
              </div>
              <div style={{ paddingTop: '4px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#f0efe8', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                  {step.title}
                </div>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.65 }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
