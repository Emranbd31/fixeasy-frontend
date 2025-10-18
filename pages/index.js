import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import ServiceIcon from '../components/icons/ServiceIcon'
import { SERVICE_GROUPS } from '../data/services'

/* === HERO DATA === */
const HERO_FLAIR = [
  { icon: '⚡', label: 'Same-day emergency support' },
  { icon: '🛡️', label: 'Garda-vetted & insured professionals' },
  { icon: '💬', label: 'Live updates from the FixEasy team' }
]

const HERO_METRICS = [
  { headline: '18k+', subline: 'Jobs completed nationwide' },
  { headline: '1,200+', subline: 'Trade specialists on FixEasy' },
  { headline: '4.9/5', subline: 'Average client rating' }
]

const HERO_RIBBON = [
  'Plumbers on call 24/7',
  'Eco-friendly cleaning teams',
  'Smart home & EV charger installs',
  'Roofing and gutter experts',
  'Heating & boiler maintenance'
]

/* === WHY FIXEASY === */
const EXPERIENCE_CARDS = [
  {
    icon: '🧭',
    title: 'Personalised bookings',
    description:
      'A guided intake captures your problem, preferences, and photos so the right specialist accepts instantly.',
    accent: '3-minute average booking'
  },
  {
    icon: '🛡️',
    title: 'Verification at every step',
    description:
      'Identity, insurance, and ongoing quality checks keep FixEasy safe for Irish households and businesses.',
    accent: '98% satisfaction score'
  },
  {
    icon: '📦',
    title: 'End-to-end support',
    description:
      'Track milestones, chat with your pro, and manage invoices directly in your FixEasy dashboard.',
    accent: 'Secure payments & receipts'
  }
]

/* === HOW IT WORKS === */
const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Tell us the job',
    description:
      'Choose a FixEasy category or describe a custom request — photos welcome.'
  },
  {
    step: '02',
    title: 'Match within minutes',
    description:
      'We pair you with a vetted professional and confirm transparent pricing.'
  },
  {
    step: '03',
    title: 'Relax while we handle it',
    description:
      'Your FixEasy concierge monitors progress and ensures satisfaction.'
  }
]

 codex/fix-configuration-update-issues-91042p
const TRUST_HIGHLIGHTS = [
  {
    title: 'Insurance & compliance',
    description: 'Professionals maintain active public liability insurance and pass Garda vetting before accepting work.'
  },
  {
    title: 'Secure, cashless payments',
    description: 'Every transaction is processed via Stripe Connect with detailed receipts and VAT-ready invoices.'
  },
  {
    title: 'Always-on concierge',
    description: 'Our Dublin support hub tracks each booking, resolves issues, and keeps clients informed in real time.'
  }
]

=======
/* === TRUST HIGHLIGHTS === */
const TRUST_HIGHLIGHTS = [
  {
    title: 'Insurance & compliance',
    description:
      'All professionals carry public liability insurance and Garda vetting.'
  },
  {
    title: 'Secure, cashless payments',
    description:
      'Payments processed via Stripe with instant VAT-ready invoices.'
  },
  {
    title: 'Always-on concierge',
    description:
      'Our Dublin team oversees every booking and ensures real-time support.'
  }
]

/* === CONTACT OPTIONS === */
 main
const CONTACT_OPTIONS = [
  {
    title: 'Talk to support',
    description: 'Our Dublin team is available Monday–Saturday.',
    href: 'mailto:support@fixeasy.irish',
    action: 'support@fixeasy.irish'
  },
  {
    title: 'Call us',
    description: 'Prefer the phone? Book or update instantly.',
    href: 'tel:+35315510000',
    action: '+353 1 551 0000'
  },
  {
    title: 'System status',
    description: 'Check uptime and maintenance schedules.',
    href: 'https://status.fixeasy.irish',
    action: 'status.fixeasy.irish'
  }
]

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const ribbonItems = useMemo(() => [...HERO_RIBBON, ...HERO_RIBBON], [])

  /* === Sticky header === */
  useEffect(() => {
 codex/fix-configuration-update-issues-91042p
    if (typeof window === 'undefined') return
=======
 main
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* === Sync & verify user role === */
  useEffect(() => {
    if (typeof window === 'undefined') return
 codex/fix-configuration-update-issues-91042p

    let isActive = true
    const storedRole = window.localStorage.getItem('fixeasy_role')
    if (storedRole) setUserRole(storedRole)

    const handleStorage = (event) => {
      if (event.key === 'fixeasy_role') {
        setUserRole(event.newValue)
      }
    }

    window.addEventListener('storage', handleStorage)

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null

    const verifyAdmin = async () => {
      if (storedRole || typeof fetch === 'undefined') return

      try {
        const response = await fetch('/api/auth/admin/session', {
          signal: controller?.signal
        })
        if (!isActive || !response?.ok) return
        window.localStorage.setItem('fixeasy_role', 'admin')
        setUserRole('admin')
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Failed to verify admin session', error)

    let active = true

    const stored = localStorage.getItem('fixeasy_role')
    if (stored) setUserRole(stored)

    const syncRole = (e) => {
      if (e.key === 'fixeasy_role') setUserRole(e.newValue)
    }
    window.addEventListener('storage', syncRole)

    const verifyAdmin = async () => {
      try {
        const res = await fetch('/api/auth/admin/session')
        if (active && res.ok) {
          localStorage.setItem('fixeasy_role', 'admin')
          setUserRole('admin')
        }
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Admin check failed:', err)
 main
        }
      }
    }

    verifyAdmin()
 codex/fix-configuration-update-issues-91042p

    return () => {
      isActive = false
      window.removeEventListener('storage', handleStorage)
      controller?.abort()

    return () => {
      active = false
      window.removeEventListener('storage', syncRole)
 main
    }
  }, [])

  const isLoggedIn = Boolean(userRole)
  const dashboardHref =
    userRole === 'admin'
      ? '/dashboard/admin'
      : userRole === 'pro'
      ? '/dashboard/pro'
      : userRole === 'client'
      ? '/dashboard/client'
      : '/signup'

  return (
    <div className="homepage">
      <Head>
        <title>FixEasy — Trusted Home-Service Professionals Across Ireland</title>
        <meta
          name="description"
          content="Book verified plumbers, electricians, cleaners, and more across Ireland with FixEasy — transparent, secure, and fast."
        />
      </Head>

codex/fix-configuration-update-issues-91042p
    
      {/* === NAVBAR === */}
 main
      <header className={`clean-nav ${isScrolled ? 'clean-nav--sticky' : ''}`}>
        <div className="container clean-nav__inner">
          <Link href="/" className="clean-nav__brand" aria-label="FixEasy homepage">
            <span className="clean-nav__logo">ƒ</span>
            <span className="clean-nav__name">FixEasy</span>
          </Link>

          <nav className="clean-nav__links">
            <Link href="#services">Services</Link>
            <Link href="#workflow">How it works</Link>
 codex/fix-configuration-update-issues-91042p
            <Link href="#trust">Why FixEasy</Link>

            <Link href="#trust">Trust</Link>
 main
            <Link href="#contact">Contact</Link>
          </nav>

          <div className="clean-nav__actions">
            {isLoggedIn ? (
              <Link href={dashboardHref} className="clean-nav__btn clean-nav__btn--primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup" className="clean-nav__btn clean-nav__btn--ghost">
                  Sign in / Sign up
                </Link>
                <Link href="/register/client" className="clean-nav__btn clean-nav__btn--primary">
                  Book a Service
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* === HERO === */}
      <main>
        <section className="clean-hero">
          <div className="clean-hero__background" />
          <div className="container clean-hero__layout">
            <div className="clean-hero__copy">
              <span className="clean-hero__eyebrow">
                Ireland’s trusted home-service marketplace
              </span>
              <h1>Trusted Professionals. Verified for Your Peace of Mind.</h1>
              <p className="clean-hero__lead">
 codex/fix-configuration-update-issues-91042p
                Book FixEasy services with transparent pricing, secure payments, and same-day availability. We connect your home
                with Garda-vetted experts ready to help across Ireland.

                Transparent pricing, secure payments, and same-day availability.
                FixEasy connects Irish homes with vetted experts.
 main
              </p>
              <div className="clean-hero__cta-group">
                <Link href="/register/client" className="clean-hero__cta clean-hero__cta--primary">
                  Book a Service
                </Link>
                <Link href="/register/pro" className="clean-hero__cta clean-hero__cta--secondary">
                  Join as a Professional
                </Link>
              </div>
              <div className="clean-hero__metrics">
 codex/fix-configuration-update-issues-91042p
                {HERO_METRICS.map((stat, index) => (
                  <div
                    key={stat.headline}
                    className="clean-hero__stat"
                    style={{ '--delay': `${index * 80}ms` }}
                  >

                {HERO_METRICS.map((stat) => (
                  <div key={stat.headline} className="clean-hero__stat">
 main
                    <strong>{stat.headline}</strong>
                    <span>{stat.subline}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="clean-hero__visual">
              <div className="clean-hero__image-frame">
                <Image
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80"
                  alt="FixEasy professional assisting a homeowner"
 codex/fix-configuration-update-issues-91042p
                  fill
                  priority
                  className="clean-hero__image"
                  sizes="(min-width: 1024px) 420px, (min-width: 768px) 360px, 88vw"

                  width={520}
                  height={400}
                  priority
                  className="clean-hero__image"
 main
                />
              </div>
              <div className="clean-hero__ticket">
                <span className="clean-hero__ticket-label">Live concierge</span>
                <p>“We’ll confirm your specialist and arrival window within minutes.”</p>
                <ul className="clean-hero__ticket-list">
                  {HERO_FLAIR.map((item) => (
                    <li key={item.label}>
                      <span>{item.icon}</span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

 codex/fix-configuration-update-issues-91042p
        <section className="section clean-experience">
          <div className="container">
            <div className="section__header">
              <span className="section__eyebrow">Why FixEasy</span>
              <h2 className="section__title">Premium support for every booking</h2>
              <p className="section__description">
                Every request is paired with concierge oversight, quality scoring, and digital audit trails from quote to
                completion.
              </p>
            </div>
            <div className="clean-experience__grid">
              {EXPERIENCE_CARDS.map((card) => (
                <article key={card.title}>
                  <span className="clean-experience__icon" aria-hidden="true">
                    {card.icon}
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <span className="clean-experience__accent">{card.accent}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="clean-ribbon" aria-hidden="true">
          <div className="clean-ribbon__track">
            {ribbonItems.map((item, index) => (
              <span key={`${item}-${index}`} className="clean-ribbon__item">
                {item}
              </span>
=======
        {/* === RIBBON === */}
        <section className="clean-ribbon" aria-hidden="true">
          <div className="clean-ribbon__track">
            {ribbonItems.map((item, i) => (
              <span key={`${item}-${i}`}>{item}</span>
 main
            ))}
          </div>
        </section>

 codex/fix-configuration-update-issues-91042p
        <section id="services" className="section clean-services">
          <div className="section__header">
            <span className="section__eyebrow">Service catalogue</span>
            <h2 className="section__title">Every FixEasy specialist, in one place</h2>
            <p className="section__description">
              From urgent call-outs to planned projects, book trusted tradespeople with full insurance, reviews, and digital
              paperwork.
            </p>
          </div>
          <div className="clean-services__grid">
            {SERVICE_GROUPS.map((group) => (
              <article key={group.id} className="clean-services__card">
                <header>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </header>
                <ul>
                  {group.services.map((service) => (
                    <li key={service.id}>
                      <ServiceIcon type={service.icon} className="clean-services__icon" />
                      <div>
                        <strong>{service.name}</strong>
                        <p>{service.summary}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="section clean-workflow">
          <div className="container clean-workflow__inner">
            <div className="clean-workflow__intro">
              <span className="section__eyebrow">How FixEasy works</span>
              <h2>Secure bookings with concierge support</h2>
              <p>
                Every request is triaged by our support team, matched to a specialist, and tracked through completion so you can
                focus on the outcome — not the admin.
              </p>
            </div>

        {/* === WHY FIXEASY === */}
        <section id="why" className="section clean-experience">
          <div className="container">
            <header className="section__header">
              <span className="section__eyebrow">Why FixEasy</span>
              <h2>Premium support for every booking</h2>
              <p>
                Every request includes concierge oversight, safety checks, and
                digital audit trails from quote to completion.
              </p>
            </header>

            <div className="clean-experience__grid">
              {EXPERIENCE_CARDS.map((card) => (
                <article key={card.title}>
                  <span className="clean-experience__icon">{card.icon}</span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <span className="clean-experience__accent">{card.accent}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* === SERVICES === */}
        <section id="services" className="section clean-services">
          <div className="container">
            <header className="section__header">
              <span className="section__eyebrow">Service Catalogue</span>
              <h2>Every FixEasy Specialist, in One Place</h2>
              <p>
                Book trusted tradespeople with verified credentials and digital
                paperwork.
              </p>
            </header>

            <div className="clean-services__grid">
              {SERVICE_GROUPS.map((group) => (
                <article key={group.id} className="clean-services__card">
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                  <ul>
                    {group.services.map((service) => (
                      <li key={service.id}>
                        <ServiceIcon type={service.icon} className="clean-services__icon" />
                        <div>
                          <strong>{service.name}</strong>
                          <p>{service.summary}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* === WORKFLOW === */}
        <section id="workflow" className="section clean-workflow">
          <div className="container">
            <header className="section__header">
              <span className="section__eyebrow">How it works</span>
              <h2>Book in minutes, stay updated all the way</h2>
              <p>
                FixEasy keeps you informed from your first message to final receipt
                — transparent and secure.
              </p>
            </header>

 main
            <ol className="clean-workflow__steps">
              {WORKFLOW_STEPS.map((step) => (
                <li key={step.step}>
                  <span className="clean-workflow__step-number">{step.step}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

 codex/fix-configuration-update-issues-91042p
        <section id="trust" className="section clean-trust">
          <div className="container">
            <div className="section__header">
              <span className="section__eyebrow">Trust & safety</span>
              <h2 className="section__title">Safeguards for clients, professionals, and data</h2>
              <p className="section__description">
                FixEasy blends compliance, security tooling, and responsive support to keep every interaction accountable and
                transparent.
              </p>
            </div>

        {/* === TRUST === */}
        <section id="trust" className="section clean-trust">
          <div className="container">
            <header className="section__header">
              <span className="section__eyebrow">Trust & Safety</span>
              <h2>Safeguards for Clients, Pros, and Data</h2>
              <p>
                FixEasy combines compliance, insurance, and concierge oversight to
                protect everyone.
              </p>
            </header>

 main
            <div className="clean-trust__grid">
              {TRUST_HIGHLIGHTS.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

 codex/fix-configuration-update-issues-91042p
        <section id="contact" className="section clean-contact">
          <div className="container">
            <div className="section__header">
              <span className="section__eyebrow">Talk to the team</span>
              <h2 className="section__title">Ready when you need us</h2>
              <p className="section__description">
                Book online or reach out directly — our concierge team keeps every FixEasy booking running smoothly.
              </p>
            </div>
            <div className="clean-contact__grid">
              {CONTACT_OPTIONS.map((option) => (
                <a key={option.title} href={option.href} className="clean-contact__card">
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  <span className="clean-contact__action">{option.action}</span>

        {/* === CONTACT === */}
        <section id="contact" className="section clean-contact">
          <div className="container">
            <header className="section__header">
              <span className="section__eyebrow">Contact</span>
              <h2>We’re here when you need us</h2>
              <p>Reach out to the FixEasy team for support or partnerships.</p>
            </header>

            <div className="clean-contact__grid">
              {CONTACT_OPTIONS.map((opt) => (
                <a key={opt.title} href={opt.href} className="clean-contact__card">
                  <h3>{opt.title}</h3>
                  <p>{opt.description}</p>
                  <span className="clean-contact__action">{opt.action}</span>
 main
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

 codex/fix-configuration-update-issues-91042p

      {/* === FOOTER === */}
 main
      <footer className="clean-footer">
        <div className="container clean-footer__inner">
          <div>
            <span className="clean-footer__logo">ƒ</span>
 codex/fix-configuration-update-issues-91042p
            <p>FixEasy connects households and businesses with vetted professionals nationwide.</p>
=======
            <p>
              FixEasy connects homes and businesses with trusted professionals
              across Ireland.
            </p>
 main
          </div>
          <div className="clean-footer__links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
 codex/fix-configuration-update-issues-91042p
            <Link href="/register/pro">Professional onboarding</Link>
          </div>
          <p className="clean-footer__copy">© {new Date().getFullYear()} FixEasy. All rights reserved.</p>

            <Link href="/register/pro">Join as Professional</Link>
          </div>
          <p className="clean-footer__copy">
            © {new Date().getFullYear()} FixEasy. All rights reserved.
          </p>
 main
        </div>
      </footer>
    </div>
  )
}
