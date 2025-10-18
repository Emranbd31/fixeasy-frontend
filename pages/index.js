import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ServiceIcon from '../components/icons/ServiceIcon'
import { SERVICE_GROUPS } from '../data/services'

const HERO_TRUST_POINTS = [
  { icon: '✅', label: 'Verified Professionals' },
  { icon: '💳', label: 'Secure Payments' },
  { icon: '🇮🇪', label: 'Irish Support 24/7' }
]

const HERO_STATS = [
  { headline: '1,200+', subline: 'Tradespeople vetted across Dublin' },
  { headline: 'Same-day', subline: 'Rapid response for urgent jobs' },
  { headline: '4.9★', subline: 'Average rating from Irish households' }
]

const CONTACT_OPTIONS = [
  {
    title: 'Talk to support',
    description: 'Need help planning a job? Our Dublin-based team is available Monday to Saturday.',
    href: 'mailto:support@fixeasy.irish',
    action: 'support@fixeasy.irish'
  },
  {
    title: 'Call us',
    description: 'Prefer the phone? Schedule or update bookings with a quick call.',
    href: 'tel:+35315510000',
    action: '+353 1 551 0000'
  },
  {
    title: 'System status',
    description: 'Check FixEasy platform uptime and upcoming maintenance windows.',
    href: 'https://status.fixeasy.irish',
    action: 'status.fixeasy.irish'
  }
]

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedRole = window.localStorage.getItem('fixeasy_role')
    if (storedRole) {
      setUserRole(storedRole)
    }

    const handleStorage = (event) => {
      if (event.key === 'fixeasy_role') {
        setUserRole(event.newValue)
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  useEffect(() => {
    let isActive = true
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/auth/admin/session')
        if (!isActive) return
        if (response.ok) {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('fixeasy_role', 'admin')
          }
          setUserRole('admin')
        }
      } catch (error) {
        console.warn('Failed to verify admin session', error)
      }
    }

    checkAdmin()

    return () => {
      isActive = false
    }
  }, [])

  const isLoggedIn = useMemo(() => Boolean(userRole), [userRole])
  const dashboardHref = useMemo(() => {
    if (userRole === 'admin') return '/dashboard/admin'
    if (userRole === 'pro') return '/dashboard/pro'
    if (userRole === 'client') return '/dashboard/client'
    return '/signup'
  }, [userRole])

  return (
    <div className="landing">
      <Head>
        <title>FixEasy — Trusted Home-Service Professionals Across Ireland</title>
        <meta
          name="description"
          content="Book verified plumbers, electricians, cleaners, and more across Ireland with FixEasy. One secure platform for every home-service need."
        />
      </Head>

      <header className={`global-nav ${isScrolled ? 'global-nav--scrolled' : ''}`}>
        <div className="global-nav__inner">
          <Link href="/" className="global-nav__brand" aria-label="FixEasy homepage">
            <span className="global-nav__logo" aria-hidden="true">
              ƒ
            </span>
            <span className="global-nav__name">FixEasy</span>
          </Link>
          <nav className="global-nav__links" aria-label="Primary">
            <Link href="#services">Services</Link>
            <Link href="#contact">Contact</Link>
            <a href="https://status.fixeasy.irish" target="_blank" rel="noreferrer">
              Status
            </a>
          </nav>
          <div className="global-nav__actions">
            {isLoggedIn ? (
              <Link href={dashboardHref} className="nav-btn nav-btn--primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup" className="nav-btn nav-btn--ghost">
                  Sign in / Sign up
                </Link>
                <Link href="/register/client" className="nav-btn nav-btn--primary">
                  Book a Service
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="hero-2025" aria-labelledby="hero-heading">
          <div className="hero-2025__gradient" aria-hidden="true" />
          <div className="container hero-2025__grid">
            <div className="hero-2025__content">
              <span className="hero-2025__eyebrow">Ireland’s trusted home services platform</span>
              <h1 id="hero-heading">Trusted Professionals. Verified for Your Peace of Mind.</h1>
              <p className="hero-2025__lead">
                Book FixEasy services with transparent pricing, secure payments, and same-day availability. Every professional is
                ID-checked, insured, and ready to help.
              </p>
              <div className="hero-2025__actions" role="group" aria-label="Primary actions">
                <Link href="/register/client" className="hero-2025__cta hero-2025__cta--primary">
                  Book a Service
                </Link>
                <Link href="/register/pro" className="hero-2025__cta hero-2025__cta--secondary">
                  Join as Professional
                </Link>
              </div>
              <div className="hero-2025__trust-card">
                <ul>
                  {HERO_TRUST_POINTS.map((point) => (
                    <li key={point.label}>
                      <span aria-hidden="true">{point.icon}</span>
                      {point.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hero-2025__stats" role="list">
                {HERO_STATS.map((stat) => (
                  <motion.div
                    key={stat.headline}
                    className="hero-2025__stat"
                    role="listitem"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.35 }}
                  >
                    <strong>{stat.headline}</strong>
                    <span>{stat.subline}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="hero-2025__visual">
              <div className="hero-2025__image-frame">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80"
                  alt="FixEasy professionals completing home repairs"
                  loading="lazy"
                />
              </div>
              <div className="hero-2025__badge">
                <span>Over 1,200 verified tradespeople</span>
                <span>Guaranteed same-day response</span>
              </div>
            </div>
          </div>
        </section>

        <section className="service-showcase section section--light" id="services" aria-labelledby="services-heading">
          <div className="container">
            <header className="section__header">
              <span className="section__eyebrow">Services</span>
              <h2 id="services-heading">Choose a service and book in seconds</h2>
              <p className="section__description">
                Explore FixEasy categories inspired by Ireland’s most requested jobs. Tap any tile to start a booking with the
                service pre-filled.
              </p>
            </header>

            <div className="service-showcase__groups">
              {SERVICE_GROUPS.map((group) => (
                <section key={group.id} className="service-showcase__group" aria-labelledby={`${group.id}-title`}>
                  <div className="service-showcase__group-header">
                    <h3 id={`${group.id}-title`}>{group.title}</h3>
                    <p>{group.description}</p>
                  </div>
                  <div className="service-showcase__tiles" role="list">
                    {group.services.map((service, index) => (
                      <motion.div
                        key={service.id}
                        role="listitem"
                        className="service-tile-wrapper"
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.35, delay: index * 0.05 }}
                      >
                        <Link
                          href={{ pathname: '/register/client', query: { service: service.name } }}
                          className="service-tile"
                        >
                          <ServiceIcon type={service.icon} className="service-tile__icon" />
                          <div className="service-tile__copy">
                            <h4>{service.name}</h4>
                            <p>{service.summary}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section" aria-labelledby="cta-heading">
          <div className="container cta-container">
            <div className="cta-text">
              <span className="section__eyebrow">Book with confidence</span>
              <h2 id="cta-heading">Ready for your next repair or refresh?</h2>
              <p>
                Submit a booking request in minutes to receive verified professionals, live updates, and protected payments
                under one secure FixEasy account.
              </p>
            </div>
            <div className="cta-actions">
              <Link href="/register/client" className="cta-btn cta-btn--primary">
                Book a Service
              </Link>
              <Link href="/register/pro" className="cta-btn cta-btn--ghost">
                Join as Professional
              </Link>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-heading">
          <div className="container">
            <header className="section__header">
              <span className="section__eyebrow">Contact</span>
              <h2 id="contact-heading">We are here when you need us</h2>
              <p className="section__description">
                Reach out to the FixEasy team for booking support, partnership enquiries, or to check live platform status.
              </p>
            </header>
            <div className="contact-grid">
              {CONTACT_OPTIONS.map((item) => (
                <article key={item.title} className="contact-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href={item.href} className="contact-card__action">
                    {item.action}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" aria-label="Footer">
        <div className="container site-footer__inner">
          <div className="site-footer__brand">
            <span className="site-footer__logo" aria-hidden="true">
              ƒ
            </span>
            <span className="site-footer__name">FixEasy Ireland</span>
          </div>
          <nav aria-label="Footer">
            <a href="/terms">Terms &amp; Conditions</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="https://status.fixeasy.irish" target="_blank" rel="noreferrer">
              Status
            </a>
          </nav>
          <p className="site-footer__copy">© 2025 FixEasy Ireland. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
