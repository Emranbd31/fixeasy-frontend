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

    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedRole = window.localStorage.getItem('fixeasy_role')
    if (storedRole) setUserRole(storedRole)

    const handleStorage = (event) => {
      if (event.key === 'fixeasy_role') setUserRole(event.newValue)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
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

      {/* NAVBAR */}
      <header className={`clean-nav ${isScrolled ? 'clean-nav--sticky' : ''}`}>
        <div className="container clean-nav__inner">
          <Link href="/" className="clean-nav__brand" aria-label="FixEasy homepage">
            <span className="clean-nav__logo">ƒ</span>
            <span className="clean-nav__name">FixEasy</span>
          </Link>
          <nav className="clean-nav__links">
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
        {/* HERO */}
        <section className="clean-hero">
          <div className="clean-hero__background" />
          <div className="container clean-hero__layout">
            <div className="clean-hero__copy">
              <span className="clean-hero__eyebrow">Ireland’s trusted home-service marketplace</span>
              <h1>Trusted Professionals. Verified for Your Peace of Mind.</h1>
              <p className="clean-hero__lead">
                Book FixEasy services with transparent pricing, secure payments, and same-day availability. We connect your
                home with Garda-vetted experts ready to help across Ireland.
              </p>
              <div className="clean-hero__cta-group">
                <Link href="/register/client" className="clean-hero__cta clean-hero__cta--primary">
                  Book a Service
                </Link>
                <Link href="/register/pro" className="clean-hero__cta clean-hero__cta--secondary">
                  Join as Professional
                </Link>
              </div>
              <ul className="clean-hero__trust">
                {['✅ Verified Professionals', '💳 Secure Payments', '🇮🇪 Irish Support 24/7'].map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="clean-hero__stats">
                {HERO_METRICS.map((stat) => (
                  <motion.div
                    key={stat.headline}
                    className="clean-hero__stat"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
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

        {/* RIBBON */}
        <section className="clean-ribbon" aria-hidden="true">
          <div className="clean-ribbon__track">
            {HERO_RIBBON.concat(HERO_RIBBON).map((item
