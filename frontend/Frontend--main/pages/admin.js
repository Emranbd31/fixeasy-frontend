import { useMemo, useState } from 'react'
import Head from 'next/head'

const ADMIN_EMAIL = 'emranbd31@gmail.com'
const ADMIN_PASSWORD = 'Shuki@112'

const summaryCards = [
  {
    label: 'Active bookings',
    value: '128',
    trend: '+12%',
    trendLabel: 'vs last week',
    accent: 'primary'
  },
  {
    label: 'Resolution SLA',
    value: '97.6%',
    trend: '+2.1%',
    trendLabel: 'breaches down',
    accent: 'success'
  },
  {
    label: 'Payouts scheduled',
    value: '€42.8k',
    trend: '18 pending',
    trendLabel: 'Stripe Connect',
    accent: 'surface'
  },
  {
    label: 'Open escalations',
    value: '3',
    trend: '1 new',
    trendLabel: 'needs review',
    accent: 'warning'
  }
]

const recentBookings = [
  {
    id: '#BK-2481',
    client: 'Sarah O’Connell',
    service: 'Emergency plumbing',
    scheduled: 'Today · 14:30',
    status: 'En route'
  },
  {
    id: '#BK-2479',
    client: 'Thompson & Co',
    service: 'Office deep clean',
    scheduled: 'Tomorrow · 07:45',
    status: 'Confirmed'
  },
  {
    id: '#BK-2472',
    client: 'Kevin Daly',
    service: 'EV charger install',
    scheduled: 'Thu · 09:00',
    status: 'Awaiting docs'
  }
]

const escalations = [
  {
    id: '#ESC-58',
    title: 'Water damage follow-up',
    owner: 'Niamh Walsh',
    updated: '12 min ago',
    severity: 'High'
  },
  {
    id: '#ESC-59',
    title: 'Reschedule SLA breach',
    owner: 'Patrick Byrne',
    updated: '24 min ago',
    severity: 'Medium'
  }
]

const securityEvents = [
  {
    id: '#SE-4412',
    description: 'New device approval · pro.jimenez@fixeasy',
    timestamp: '10:21',
    badge: 'info'
  },
  {
    id: '#SE-4411',
    description: 'Turnstile challenge solved · contact form',
    timestamp: '09:55',
    badge: 'success'
  },
  {
    id: '#SE-4406',
    description: 'MFA enforcement reminder · 6 providers',
    timestamp: '08:17',
    badge: 'warning'
  }
]

const quickActions = [
  'Create manual booking',
  'Issue partial refund',
  'Trigger KYC refresh',
  'Send client update',
  'Add feature flag override'
]

export default function AdminDashboard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const nextAction = useMemo(() => quickActions[0], [])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
      return
    }

    setError('Invalid credentials. Please check the email and password and try again.')
  }

  return (
    <div className="admin-page">
      <Head>
        <title>FixEasy Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {!isAuthenticated ? (
        <div className="admin-login">
          <div className="admin-login__card" role="dialog" aria-modal="true">
            <h1>Admin access</h1>
            <p>Use your FixEasy admin credentials to continue.</p>
            <form className="admin-login__form" onSubmit={handleSubmit}>
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
              />

              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />

              {error ? <p className="admin-login__error">{error}</p> : null}

              <button type="submit" className="admin-login__submit">
                Sign in
              </button>
            </form>
            <p className="admin-login__hint">Demo account: {ADMIN_EMAIL}</p>
          </div>
        </div>
      ) : (
        <main className="admin-dashboard">
          <header className="admin-dashboard__header">
            <div>
              <p className="admin-dashboard__eyebrow">Dashboard</p>
              <h1>Welcome back, Emran</h1>
              <p className="admin-dashboard__subtitle">
                Here’s an overview of today’s operations, escalations, and security posture across FixEasy.
              </p>
            </div>
            <button type="button" className="admin-dashboard__primary">
              Create update
            </button>
          </header>

          <section className="admin-dashboard__grid">
            {summaryCards.map((card) => (
              <article key={card.label} className={`admin-card admin-card--${card.accent}`}>
                <p className="admin-card__label">{card.label}</p>
                <p className="admin-card__value">{card.value}</p>
                <p className="admin-card__trend">
                  <span>{card.trend}</span> {card.trendLabel}
                </p>
              </article>
            ))}
          </section>

          <section className="admin-panels">
            <div className="admin-panel admin-panel--wide">
              <header className="admin-panel__header">
                <h2>Live bookings</h2>
                <button type="button">View all</button>
              </header>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Booking</th>
                    <th scope="col">Client</th>
                    <th scope="col">Service</th>
                    <th scope="col">Schedule</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.client}</td>
                      <td>{booking.service}</td>
                      <td>{booking.scheduled}</td>
                      <td>
                        <span className="admin-status-chip">{booking.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="admin-panel admin-panel--stacked">
              <div className="admin-panel__block">
                <header className="admin-panel__header">
                  <h2>Escalations</h2>
                  <button type="button">Assign</button>
                </header>
                <ul className="admin-list">
                  {escalations.map((item) => (
                    <li key={item.id}>
                      <div>
                        <p className="admin-list__title">{item.title}</p>
                        <p className="admin-list__meta">
                          {item.owner} · {item.updated}
                        </p>
                      </div>
                      <span className={`admin-chip admin-chip--${item.severity.toLowerCase()}`}>{item.severity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="admin-panel__block">
                <header className="admin-panel__header">
                  <h2>Security events</h2>
                  <button type="button">Audit log</button>
                </header>
                <ul className="admin-list admin-list--dense">
                  {securityEvents.map((event) => (
                    <li key={event.id}>
                      <div>
                        <p className="admin-list__title">{event.description}</p>
                        <p className="admin-list__meta">{event.timestamp}</p>
                      </div>
                      <span className={`admin-chip admin-chip--${event.badge}`}>New</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="admin-panel__block admin-panel__block--actions">
                <h2>Quick actions</h2>
                <ul className="admin-actions">
                  {quickActions.map((action) => (
                    <li key={action}>
                      <button type="button">{action}</button>
                    </li>
                  ))}
                </ul>
                <p className="admin-panel__hint">Suggested next step: {nextAction}</p>
              </div>
            </aside>
          </section>
        </main>
      )}
    </div>
  )
}
