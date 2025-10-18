import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const DASHBOARD_ROLES = [
  {
    id: 'client',
    title: 'Client overview',
    description: 'Track bookings, chat with your professional, and manage secure payments.',
    highlights: ['Live concierge updates', 'Instant invoices', 'Satisfaction feedback loops'],
    href: '/dashboard/client',
    cta: 'Open client view'
  },
  {
    id: 'pro',
    title: 'Professional workspace',
    description: 'Accept jobs, manage routes, and monitor earnings in one streamlined hub.',
    highlights: ['Availability calendar', 'Stripe Connect payouts', 'Quality scorecards'],
    href: '/dashboard/pro',
    cta: 'Open professional view'
  },
  {
    id: 'admin',
    title: 'Operations control centre',
    description: 'Run verifications, manage escalations, and keep SLAs on track.',
    highlights: ['Bookings intelligence', 'Trust & safety tooling', 'Realtime security feed'],
    href: '/dashboard/admin',
    cta: 'Open admin view'
  }
]

const SUPPORT_SHORTCUTS = [
  { label: 'View rollout plan', href: '/plan' },
  { label: 'Book a service', href: '/register/client' },
  { label: 'Need help? Email support@fixeasy.irish', href: 'mailto:support@fixeasy.irish', external: true }
]

export default function DashboardLanding() {
  const [role, setRole] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('fixeasy_role')
    if (stored) {
      setRole(stored)
    }
  }, [])

  const recommendedCard = useMemo(() => {
    if (!role) return DASHBOARD_ROLES[0]
    return DASHBOARD_ROLES.find((entry) => entry.id === role) ?? DASHBOARD_ROLES[0]
  }, [role])

  return (
    <div className="dashboard-overview">
      <Head>
        <title>FixEasy Dashboards — Choose your workspace</title>
        <meta
          name="description"
          content="Pick the FixEasy dashboard that matches your role — clients, professionals, and admins each get a tailored hub."
        />
      </Head>

      <main className="container dashboard-overview__main">
        <header className="dashboard-overview__hero">
          <span className="dashboard-overview__eyebrow">Dashboards</span>
          <h1>One platform, three workspaces</h1>
          <p>
            FixEasy adapts to whoever signs in. Keep an eye on the role saved in your browser or jump straight into the space you
            need right now.
          </p>
          <div className="dashboard-overview__pill">Recommended: {recommendedCard.title}</div>
        </header>

        <section className="dashboard-overview__grid" aria-label="Dashboard options">
          {DASHBOARD_ROLES.map((card) => (
            <article key={card.id} className="dashboard-overview__card">
              <div className="dashboard-overview__card-head">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </div>
              <ul>
                {card.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href={card.href} className="dashboard-overview__cta">
                {card.cta}
              </Link>
            </article>
          ))}
        </section>

        <section className="dashboard-overview__footer">
          <h2>Need something else?</h2>
          <div className="dashboard-overview__shortcuts">
            {SUPPORT_SHORTCUTS.map((item) => {
              if (item.external) {
                return (
                  <a key={item.href} href={item.href} className="dashboard-overview__shortcut">
                    {item.label}
                  </a>
                )
              }
              return (
                <Link key={item.href} href={item.href} className="dashboard-overview__shortcut">
                  {item.label}
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
