import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const metrics = [
  { label: 'Verified professionals', value: '3,200+' },
  { label: 'Service categories', value: '28' },
  { label: 'Average response time', value: '11m' },
  { label: 'GDPR DSAR turnaround', value: '<48h' }
]

const differentiators = [
  {
    title: 'Zero-trust security',
    copy:
      'SSO, MFA, signed webhooks, and device posture checks are enforced across every FixEasy portal and API surface.'
  },
  {
    title: 'Compliance by design',
    copy:
      'Irish and EU regulatory requirements baked into onboarding, payouts, and audit trails with data minimisation.'
  },
  {
    title: 'Observability built-in',
    copy:
      'Structured logs, metrics, and OpenTelemetry traces provide clear accountability for every booking and payout action.'
  }
]

const testimonials = [
  {
    quote:
      'FixEasy handles all verification and payouts, letting our technicians focus on customer experience while staying compliant.',
    author: 'Saoirse O’Connell, Facilities Director'
  },
  {
    quote:
      'Clients love the transparency. They can see every step from booking to invoice with Irish-based support on standby.',
    author: 'Aaron Walsh, Senior Operations Manager'
  }
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="hero">
          <div className="container">
            <p style={{ textTransform: 'uppercase', letterSpacing: '0.25em', color: '#64748b' }}>Enterprise marketplace</p>
            <h1 className="hero__headline">Secure home services for Ireland</h1>
            <p className="hero__copy">
              FixEasy blends instant digital onboarding with enterprise-grade controls. Clients, professionals, and admins work
              from a single zero-trust platform.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="/signup">
                Create an account
              </a>
              <a className="btn btn-secondary" href="/terms">
                Review legal terms
              </a>
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="grid grid-2">
              {metrics.map((metric) => (
                <div key={metric.label} className="card">
                  <p style={{ fontSize: '2.5rem', fontWeight: 700 }}>{metric.value}</p>
                  <p style={{ color: '#475569', margin: 0 }}>{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            <h2>Why FixEasy?</h2>
            <div className="grid grid-2">
              {differentiators.map((item) => (
                <div key={item.title} className="card">
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            <h2>Trusted by Irish operators</h2>
            <div className="grid grid-2">
              {testimonials.map((item) => (
                <blockquote key={item.author} className="card" style={{ fontStyle: 'italic' }}>
                  <p>“{item.quote}”</p>
                  <footer style={{ marginTop: '1rem', fontWeight: 600 }}>{item.author}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
