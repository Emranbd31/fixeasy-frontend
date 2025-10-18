import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ServiceIcon from '../components/icons/ServiceIcon'
import { SERVICE_GROUPS } from '../data/services'

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

const EXPERIENCE_CARDS = [
  {
    icon: '🧭',
    title: 'Personalised bookings',
    description:
      'A guided intake captures the exact problem, schedule preferences, and supporting photos so the right specialist accepts instantly.',
    accent: '3 minute average booking'
  },
  {
    icon: '🛡️',
    title: 'Verification at every step',
    description:
      'Identity, insurance, and continuous quality scoring keep the marketplace safe for Irish households and property managers.',
    accent: '98% satisfaction score'
  },
  {
    icon: '📦',
    title: 'End-to-end support',
    description:
      'Track milestones, message your professional, and manage invoices from a single FixEasy dashboard that travels with you.',
    accent: 'Secure payments & receipts'
  }
]

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Tell us the job',
    description: 'Choose from FixEasy categories or describe a bespoke request — photos welcome.'
  },
  {
    step: '02',
    title: 'Match within minutes',
    description: 'We pair you with a vetted professional and share transparent pricing before work begins.'
  },
  {
    step: '03',
    title: 'Relax while we handle it',
    description: 'Your FixEasy concierge monitors progress, ensuring quality delivery and follow-up support.'
  }
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
    <div className="homepage">
      <Head>
        <title>FixEasy — Trusted Home-Service Professionals Across Ireland</title>
        <meta
          name="description"
          content="Book verified plumbers, electricians, cleaners, and more across Ireland with FixEasy. One secure platform for every home-service need."
        />
      </Head>

      <header className={`clean-nav ${isScrolled ? 'clean-nav--sticky' : ''}`}>
        <div className="container clean-nav__inner">
          <Link href="/" className="clean-nav__brand" aria-label="FixEasy homepage">
            <span className="clean-nav__logo" aria-hidden="true">
              ƒ
            </span>
            <span className="clean-nav__name">FixEasy</span>
          </Link>
          <nav className="clean-nav__links" aria-label="Primary">
            <Link href="#services">Services</Link>
            <Link href="#workflow">How it works</Link>
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

      <main>
        <section className="clean-hero" aria-labelledby="hero-heading">
          <div className="clean-hero__background" aria-hidden="true" />
          <div className="container clean-hero__layout">
            <div className="clean-hero__copy">
              <span className="clean-hero__eyebrow">Ireland’s trusted home-service marketplace</span>
              <h1 id="hero-heading">Trusted Professionals. Verified for Your Peace of Mind.</h1>
              <p className="clean-hero__lead">
                Book FixEasy services with transparent pricing, secure payments, and same-day availability. We connect your home with
                Garda-vetted experts ready to help across Ireland.
              </p>
              <div className="clean-hero__cta-group" role="group" aria-label="Primary actions">
                <Link href="/register/client" className="clean-hero__cta clean-hero__cta--primary">
                  Book a Service
                </Link>
                <Link href="/register/pro" className="clean-hero__cta clean-hero__cta--secondary">
                  Join as Professional
                </Link>
              </div>
              <ul className="clean-hero__trust" role="list">
                {[
                  '✅ Verified Professionals',
                  '💳 Secure Payments',
                  '🇮🇪 Irish Support 24/7'
                ].map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="clean-hero__stats" role="list">
                {HERO_METRICS.map((stat) => (
                  <motion.div
                    key={stat.headline}
                    className="clean-hero__stat"
                    role="listitem"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.4 }}
                  >
                    <strong>{stat.headline}</strong>
                    <span>{stat.subline}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="clean-hero__visual">
              <div className="clean-hero__image-frame">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80"
                  alt="FixEasy professional assisting a homeowner"
                  loading="lazy"
                />
              </div>
              <div className="clean-hero__ticket">
                <span className="clean-hero__ticket-label">Live concierge</span>
                <p>“We’ll confirm your specialist and arrival window within minutes.”</p>
                <ul role="list" className="clean-hero__ticket-list">
                  {HERO_FLAIR.map((item) => (
                    <li key={item.label}>
                      <span aria-hidden="true">{item.icon}</span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="clean-ribbon" aria-hidden="true">
          <div className="clean-ribbon__track">
            {HERO_RIBBON.concat(HERO_RIBBON).map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </section>

        <section className="clean-why section" aria-labelledby="experience-heading">
          <div className="container">
            <header className="section__header">
              <span className="section__eyebrow">Why FixEasy</span>
              <h2 id="experience-heading">Premium support at every step</h2>
              <p className="section__description">
                From guided bookings to insured professionals, FixEasy keeps your household projects organised and stress-free.
              </p>
            </header>
            <div className="clean-why__grid">
              {EXPERIENCE_CARDS.map((card) => (
                <article key={card.title} className="clean-why__card">
                  <span className="clean-why__icon" aria-hidden="true">
                    {card.icon}
                  </span>
                  <div className="clean-why__body">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                  <span className="clean-why__accent">{card.accent}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="clean-services section" id="services" aria-labelledby="services-heading">
          <div className="container">
            <header className="section__header">
              <span className="section__eyebrow">Services</span>
              <h2 id="services-heading">Choose the service that matches your project</h2>
              <p className="section__description">
                Explore our full FixEasy catalogue. Select any tile to launch the booking form with the service pre-filled.
              </p>
            </header>
            <div className="clean-services__groups">
              {SERVICE_GROUPS.map((group) => (
                <section key={group.id} className="clean-services__group" aria-labelledby={`${group.id}-title`}>
                  <div className="clean-services__group-header">
                    <h3 id={`${group.id}-title`}>{group.title}</h3>
                    <p>{group.description}</p>
                  </div>
                  <div className="clean-services__tiles" role="list">
                    {group.services.map((service, index) => (
                      <motion.div
                        key={service.id}
                        role="listitem"
                        className="clean-service-tile"
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.35, delay: index * 0.04 }}
                      >
                        <Link
                          href={{ pathname: '/register/client', query: { service: service.name } }}
                          className="clean-service-tile__inner"
                        >
                          <ServiceIcon type={service.icon} className="clean-service-tile__icon" />
                          <div className="clean-service-tile__copy">
                            <h4>{service.name}</h4>
                            <p>{service.summary}</p>
                          </div>
                          <span className="clean-service-tile__cta">Book now</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="clean-process section" id="workflow" aria-labelledby="workflow-heading">
          <div className="container">
            <header className="section__header">
              <span className="section__eyebrow">How it works</span>
              <h2 id="workflow-heading">Book in minutes, stay updated all the way</h2>
              <p className="section__description">
                FixEasy guides you from the first message to the final receipt with transparent updates.
              </p>
            </header>
            <div className="clean-process__steps">
              {WORKFLOW_STEPS.map((step) => (
                <article key={step.title} className="clean-process__step">
                  <span className="clean-process__index" aria-hidden="true">
                    {step.step}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="clean-cta" aria-labelledby="cta-heading">
          <div className="container clean-cta__inner">
            <div className="clean-cta__copy">
              <span className="section__eyebrow">Book with confidence</span>
              <h2 id="cta-heading">Ready for your next repair or refresh?</h2>
              <p>
                Submit your request to match with a vetted professional, receive live updates, and manage everything in one secure FixEasy
                account.
              </p>
            </div>
            <div className="clean-cta__actions">
              <Link href="/register/client" className="clean-cta__btn clean-cta__btn--primary">
                Book a Service
              </Link>
              <Link href="/register/pro" className="clean-cta__btn clean-cta__btn--ghost">
                Join as Professional
              </Link>
            </div>
          </div>
        </section>

        <section className="clean-contact section" id="contact" aria-labelledby="contact-heading">
          <div className="container">
            <header className="section__header">
              <span className="section__eyebrow">Contact</span>
              <h2 id="contact-heading">We are here when you need us</h2>
              <p className="section__description">
                Reach out to the FixEasy team for booking support, partnership enquiries, or to check live platform status.
              </p>
            </header>
            <div className="clean-contact__grid">
              {CONTACT_OPTIONS.map((item) => (
                <article key={item.title} className="clean-contact__card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href={item.href} className="clean-contact__action">
                    {item.action}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="clean-footer" aria-label="Footer">
        <div className="container clean-footer__inner">
          <div className="clean-footer__brand">
            <span className="clean-footer__logo" aria-hidden="true">
              ƒ
            </span>
            <span className="clean-footer__name">FixEasy Ireland</span>
          </div>
          <nav aria-label="Footer" className="clean-footer__links">
            <a href="/terms">Terms &amp; Conditions</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="https://status.fixeasy.irish" target="_blank" rel="noreferrer">
              Status
            </a>
          </nav>
          <p className="clean-footer__copy">© 2025 FixEasy Ireland. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
