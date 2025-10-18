const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#trust', label: 'Security' },
  { href: '#testimonials', label: 'Stories' },
  { href: '/register/client', label: 'Client sign-up' }
]

const heroStats = [
  { label: 'Average rating', value: '4.9/5', helper: 'from 12k verified jobs' },
  { label: 'Same-day slots', value: '120+', helper: 'released every morning' },
  { label: 'Response time', value: '11 min', helper: 'to confirm your booking' }
]

const heroChecklist = [
  'KYC-verified pros with live insurance',
  'Two-factor protected client and pro apps',
  'Realtime updates, chat and digital invoices'
]

const jobFeed = [
  { time: '08:20', title: 'Heating reset in Dublin 8', status: 'Completed' },
  { time: '10:05', title: 'Office deep clean in Galway', status: 'In progress' },
  { time: '12:40', title: 'EV charger install in Cork', status: 'Survey' }
]

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__container">
        <header className="hero__top">
          <a className="hero__brand" href="/">
            <span className="hero__mark" aria-hidden="true">
              ƒ
            </span>
            <span className="hero__name">FixEasy</span>
          </a>
          <nav aria-label="Primary" className="hero__nav">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="hero__nav-link">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hero__actions">
            <a href="/register/pro" className="hero__action hero__action--ghost">
              Pro onboarding
            </a>
            <a href="/register/client" className="hero__action hero__action--outline">
              Client registration
            </a>
            <a href="/book" className="hero__action hero__action--primary">
              Book a visit
            </a>
          </div>
        </header>

        <div className="hero__body">
          <div className="hero__copy">
            <p className="hero__eyebrow">Trusted home & workplace fixes across Ireland</p>
            <h1 className="hero__headline" id="hero-heading">
              One platform for secure, on-time property care
            </h1>
            <p className="hero__summary">
              FixEasy blends instant quoting, vetted professionals, and greener operations so every repair, install, or deep
              clean is delivered with full transparency and audit trails.
            </p>

            <div className="hero__cta-group" role="group" aria-label="Primary actions">
              <a href="/book" className="hero__primary-btn">
                Get an instant quote
              </a>
              <a href="#services" className="hero__secondary-btn">
                Explore services
              </a>
            </div>

            <ul className="hero__checklist">
              {heroChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <aside className="hero__panel" aria-label="Live FixEasy activity">
            <div className="hero__panel-header">
              <span className="hero__panel-title">Live job feed</span>
              <span className="hero__panel-meta">98% on-time arrivals this week</span>
            </div>
            <ul className="hero__panel-list">
              {jobFeed.map((job) => (
                <li key={job.title}>
                  <span className="hero__panel-time">{job.time}</span>
                  <div>
                    <div className="hero__panel-job">{job.title}</div>
                    <span className="hero__panel-status">{job.status}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="hero__stats">
              {heroStats.map((item) => (
                <div key={item.label} className="hero__stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <small>{item.helper}</small>
                </div>
              ))}
            </div>
            <p className="hero__panel-foot">Synced with pro apps • Carbon impact logged automatically</p>
          </aside>
        </div>
      </div>
    </section>
  )
}
