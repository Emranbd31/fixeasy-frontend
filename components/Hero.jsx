import { motion } from "framer-motion"

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#sustainability", label: "Trust & ESG" },
  { href: "#testimonials", label: "Reviews" }
]

const timeline = [
  {
    time: "08:45",
    title: "Emergency leak repair",
    detail: "Pro assigned • Dublin 2",
    status: "Confirmed"
  },
  {
    time: "11:20",
    title: "Workspace deep clean",
    detail: "Eco supplies requested",
    status: "In progress"
  },
  {
    time: "14:10",
    title: "EV charger install",
    detail: "Permit cleared • Cork",
    status: "Survey"
  }
]

const highlightStats = [
  { label: "Same-day slots", value: "120+", helper: "nationwide each week" },
  { label: "Pro network", value: "650", helper: "vetted specialists" },
  { label: "Response time", value: "<15m", helper: "to confirm a booking" }
]

const trustPoints = [
  "Screened, insured pros",
  "Live progress tracking",
  "Secure payments & audit trail"
]

export default function Hero() {
  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="hero__container">
        <div className="hero__nav">
          <a className="hero__brand" href="/">
            <span className="hero__brand-mark" aria-hidden="true">ƒ</span>
            <span className="hero__brand-text">FixEasy</span>
          </a>
          <nav className="hero__nav-links" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="hero__nav-link">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hero__nav-actions">
            <a className="hero__nav-link hero__nav-link--muted" href="/book#pro">
              Become a pro
            </a>
            <a className="hero__nav-link hero__nav-link--cta" href="/book">
              Book now
            </a>
          </div>
        </div>

        <div className="hero__body">
          <div className="hero__copy">
            <span className="hero__eyebrow">Live across Dublin, Cork & Galway</span>
            <h1 className="hero__headline">Home repairs handled end-to-end in one tap</h1>
            <p className="hero__text">
              FixEasy blends instant quoting, verified pros, and greener operations so every project — from leaks to office refits — stays on time and on budget.
            </p>

            <div className="hero__search" role="group" aria-labelledby="search-label">
              <span id="search-label" className="hero__search-label">
                Preview instant pricing
              </span>
              <div className="hero__search-row">
                <input
                  type="text"
                  className="hero__input"
                  placeholder="e.g. Boiler service in D08"
                  aria-label="Describe the service you need"
                />
                <a className="hero__search-submit" href="/book">
                  Check availability
                </a>
              </div>
              <p className="hero__search-note">No payment until your pro confirms.</p>
            </div>

            <ul className="hero__trust">
              {trustPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="hero__media" aria-label="Live FixEasy activity">
            <motion.div
              className="hero__panel"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <header className="hero__panel-header">
                <span className="hero__panel-pill">Live job feed</span>
                <span className="hero__panel-status">98% on-time arrivals this week</span>
              </header>
              <ul className="hero__panel-list">
                {timeline.map((job) => (
                  <li key={job.title}>
                    <span className="hero__panel-time">{job.time}</span>
                    <div>
                      <div className="hero__panel-title">{job.title}</div>
                      <div className="hero__panel-meta">{job.detail}</div>
                    </div>
                    <span className="hero__panel-chip">{job.status}</span>
                  </li>
                ))}
              </ul>
              <footer className="hero__panel-footer">
                <span className="hero__panel-dot" aria-hidden="true" />
                Updated moments ago — synced with provider apps
              </footer>
            </motion.div>

            <div className="hero__stats">
              {highlightStats.map((item) => (
                <div key={item.label} className="hero__stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <small>{item.helper}</small>
                </div>
              ))}
            </div>

            <div className="hero__quote" aria-label="Customer testimonial">
              <span className="hero__quote-badge">Customer spotlight</span>
              <p>“FixEasy had our burst pipe resolved in under an hour and shared a sustainability receipt for the visit.”</p>
              <cite>Sarah • Dublin 8 homeowner</cite>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
