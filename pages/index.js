import { useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ServiceCard from '../components/services/ServiceCard'
import { SERVICE_GROUPS } from '../data/services'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

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

const HERO_SERVICE_CARDS = [
  {
    title: 'Emergency Electricians',
    subtitle: 'Rewiring, EV chargers & safety inspections',
    image: '/images/hero-electrician.svg',
    alt: 'Electrician testing a residential fuse board',
    accent: 'Electrician response',
    layout: 'tall',
    parallax: [32, -16]
  },
  {
    title: 'Luxury Cleaning Crews',
    subtitle: 'Deep cleans, tenancy changeovers, eco-friendly products',
    image: '/images/hero-cleaner.svg',
    alt: 'Professional cleaner preparing supplies in a modern kitchen',
    accent: 'Cleaning specialists',
    layout: 'standard',
    parallax: [22, -12]
  },
  {
    title: 'Garden & Outdoor Care',
    subtitle: 'Landscaping, seasonal tidy-ups & pressure washing',
    image: '/images/hero-gardener.svg',
    alt: 'Gardener trimming hedges in a landscaped garden',
    accent: 'Gardeners',
    layout: 'wide',
    parallax: [26, -14]
  },
  {
    title: 'Precision Carpentry',
    subtitle: 'Custom storage, flooring installs & bespoke fit-outs',
    image: '/images/hero-carpenter.svg',
    alt: 'Carpenter marking timber for custom cabinetry',
    accent: 'Carpenters',
    layout: 'standard',
    parallax: [18, -10]
  },
  {
    title: 'Roof & Gutter Response',
    subtitle: 'Storm damage surveys, leak repairs & protective coatings',
    image: '/images/hero-roofer.svg',
    alt: 'Roofing specialist inspecting exterior cladding',
    accent: 'Roofing teams',
    layout: 'standard',
    parallax: [24, -12]
  },
  {
    title: 'On-Demand Tech Support',
    subtitle: 'Home office, WiFi optimisation & smart home setup',
    image: '/images/hero-tech.svg',
    alt: 'IT support specialist configuring home office equipment',
    accent: 'Tech support',
    layout: 'wide',
    parallax: [20, -18]
  }
]

const heroSectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.2 }
  }
}

const heroCopyVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
}

const heroGridVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: 'easeOut', staggerChildren: 0.12, delayChildren: 0.2 }
  }
}

const heroCardVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } }
}

function HeroServiceCard({ card, index }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-12% 0px' })
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], card.parallax)
  const classNames = ['clean-hero__card']
  if (card.layout) classNames.push(`clean-hero__card--${card.layout}`)

  return (
    <motion.article
      ref={cardRef}
      className={classNames.join(' ')}
      variants={heroCardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.99 }}
      transition={{ delay: index * 0.08 }}
    >
      <motion.div className="clean-hero__card-media" style={{ y: parallaxY }}>
        <Image
          src={card.image}
          alt={card.alt}
          fill
          priority={index < 2}
          sizes="(max-width: 600px) 92vw, (max-width: 1024px) 44vw, 320px"
          className="clean-hero__card-image"
        />
        <div className="clean-hero__card-overlay" />
      </motion.div>
      <div className="clean-hero__card-content">
        <span className="clean-hero__card-accent">{card.accent}</span>
        <h3>{card.title}</h3>
        <p>{card.subtitle}</p>
      </div>
    </motion.article>
  )
}

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

const ROLLOUT_PILLARS = [
  {
    title: 'Operational readiness',
    description: 'Reliability first: observability, runbooks, and rapid rollback paths.',
    bullets: [
      'Unified monitoring with BetterStack, Sentry, and Vercel Analytics.',
      'Deployment guardrails with preview gates and automated QA.',
      'Error budgets shared across product, ops, and engineering.'
    ]
  },
  {
    title: 'Trust & compliance',
    description: 'Security as a product feature across clients, pros, and admins.',
    bullets: [
      'Turnstile, device trust, and MFA rolled out on every critical flow.',
      'Quarterly RLS reviews and access recertification across Supabase.',
      'Signed document storage with audit logs and retention policies.'
    ]
  },
  {
    title: 'Growth loops',
    description: 'Delightful journeys that convert curious visitors into loyal advocates.',
    bullets: [
      'Guided intake with instant quotes and smart recommendations.',
      'SEO-rich service pages with CMS-controlled blocks.',
      'Continuous NPS feedback powering coaching and feature bets.'
    ]
  }
]

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const ribbonItems = useMemo(() => [...HERO_RIBBON, ...HERO_RIBBON], [])
  const services = useMemo(
    () =>
      SERVICE_GROUPS.flatMap((group) =>
        group.services.map((service) => ({
          ...service,
          group: group.title
        }))
      ),
    []
  )

  /* === Sticky header === */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* === Sync & verify user role === */
  useEffect(() => {
    if (typeof window === 'undefined') return
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
        }
      }
    }

    verifyAdmin()
    return () => {
      active = false
      window.removeEventListener('storage', syncRole)
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

      {/* === NAVBAR === */}
      <header className={`clean-nav ${isScrolled ? 'clean-nav--sticky' : ''}`}>
        <div className="container clean-nav__inner">
          <Link href="/" className="clean-nav__brand" aria-label="FixEasy homepage">
            <span className="clean-nav__logo">ƒ</span>
            <span className="clean-nav__name">FixEasy</span>
          </Link>

          <nav className="clean-nav__links">
            <Link href="#services">Services</Link>
            <Link href="#workflow">How it works</Link>
            <Link href="#trust">Trust</Link>
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
        <motion.section
          className="clean-hero"
          variants={heroSectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="clean-hero__background" />
          <div className="container clean-hero__layout">
            <motion.div className="clean-hero__copy" variants={heroCopyVariants}>
              <span className="clean-hero__eyebrow">Ireland’s trusted home-service marketplace</span>
              <h1>Trusted Professionals. Verified for Your Peace of Mind.</h1>
              <p className="clean-hero__lead">
                Transparent pricing, secure payments, and same-day availability. FixEasy connects Irish homes with vetted
                experts.
              </p>
              <motion.div className="clean-hero__cta-group" variants={heroCopyVariants}>
                <Link href="/register/client" className="clean-hero__cta clean-hero__cta--primary">
                  Book a Service
                </Link>
                <Link href="/register/pro" className="clean-hero__cta clean-hero__cta--secondary">
                  Join as Professional
                </Link>
                <Link href="/plan" className="clean-hero__cta clean-hero__cta--ghost">
                  View rollout plan
                </Link>
              </motion.div>
              <div className="clean-hero__metrics">
                {HERO_METRICS.map((stat) => (
                  <div key={stat.headline} className="clean-hero__stat">
                    <strong>{stat.headline}</strong>
                    <span>{stat.subline}</span>
                  </div>
                ))}
              </div>
              <ul className="clean-hero__flair">
                {HERO_FLAIR.map((item) => (
                  <li key={item.label}>
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div className="clean-hero__grid" variants={heroGridVariants}>
              {HERO_SERVICE_CARDS.map((card, index) => (
                <HeroServiceCard key={card.title} card={card} index={index} />
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* === RIBBON === */}
        <section className="clean-ribbon" aria-hidden="true">
          <div className="clean-ribbon__track">
            {ribbonItems.map((item, i) => (
              <span key={`${item}-${i}`}>{item}</span>
            ))}
          </div>
        </section>

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

            <motion.div
              className="clean-services__grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </motion.div>

            <motion.div
              className="clean-services__cta-wrapper"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <Link href="/plan" className="clean-services__cta">
                View All Services
              </Link>
            </motion.div>
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

        {/* === ROLLOUT === */}
        <section className="section">
          <div className="container">
            <div className="clean-rollout">
              <header className="section__header">
                <span className="section__eyebrow">Roadmap</span>
                <h2>Focused plays for the next 12 months</h2>
                <p>
                  We’re sequencing delivery so every launch makes FixEasy more reliable, more trusted, and easier to grow.
                </p>
              </header>

              <div className="clean-rollout__grid">
                {ROLLOUT_PILLARS.map((pillar) => (
                  <article key={pillar.title} className="clean-rollout__card">
                    <h3>{pillar.title}</h3>
                    <p>{pillar.description}</p>
                    <ul>
                      {pillar.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <Link href="/plan" className="clean-rollout__cta">
                Explore the full rollout plan
              </Link>
            </div>
          </div>
        </section>

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
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* === FOOTER === */}
      <footer className="clean-footer">
        <div className="container clean-footer__inner">
          <div>
            <span className="clean-footer__logo">ƒ</span>
            <p>
              FixEasy connects homes and businesses with trusted professionals
              across Ireland.
            </p>
          </div>
          <div className="clean-footer__links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/register/pro">Join as Professional</Link>
          </div>
          <p className="clean-footer__copy">
            © {new Date().getFullYear()} FixEasy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
