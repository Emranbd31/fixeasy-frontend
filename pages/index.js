import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'

const trustHighlights = [
  {
    title: 'Verified IDs',
    description: 'Multi-step identity, insurance, and compliance reviews before any booking goes live.'
  },
  {
    title: 'Secure Payments',
    description: 'Escrow-backed transactions with automated invoicing and instant payout tracking.'
  },
  {
    title: 'Irish Support 24/7',
    description: 'Dublin-based operations team with encrypted messaging and on-call escalation.'
  }
]

const heroStats = [
  {
    label: '1,200+ verified tradespeople',
    description: 'Across Dublin city & county'
  },
  {
    label: 'Same-day response',
    description: 'Guaranteed for priority jobs'
  },
  {
    label: '4.9★ average rating',
    description: 'From over 18k completed visits'
  }
]

const serviceSections = [
  {
    id: 'home-maintenance',
    title: 'Home Maintenance',
    blurb: 'Keep every room running smoothly with responsive specialists for everyday fixes.',
    services: [
      {
        name: 'Handyman',
        icon: '🛠️',
        description: 'General repairs, door adjustments, fixture replacements, and quick home fixes.'
      },
      {
        name: 'Helping Hand',
        icon: '🤝',
        description: 'Extra support for move-in days, furniture moves, and around-the-home assistance.'
      },
      {
        name: 'Locksmith',
        icon: '🔐',
        description: '24/7 lockouts, smart lock installs, and secure rekeying for your property.'
      },
      {
        name: 'Appliance Installer',
        icon: '🔌',
        description: 'Manufacturer-approved installs with safety testing for kitchen and laundry appliances.'
      },
      {
        name: 'Furniture Assembler',
        icon: '🪑',
        description: 'Flat-pack builds, workspace fit-outs, and on-site adjustments for a perfect finish.'
      },
      {
        name: 'Appliance Repairs',
        icon: '🧯',
        description: 'Emergency fixes and preventative maintenance for kitchen and laundry appliances.'
      },
      {
        name: 'Window Cleaning',
        icon: '🪟',
        description: 'Crystal clear results inside and out with water-fed reach systems.'
      },
      {
        name: 'Gutter Maintenance',
        icon: '🪣',
        description: 'Deep cleans, leaf-guard installs, and drainage repairs ready for Irish weather.'
      }
    ]
  },
  {
    id: 'cleaning-hygiene',
    title: 'Cleaning & Hygiene',
    blurb: 'Healthy homes and workplaces maintained by vetted cleaning experts.',
    services: [
      {
        name: 'Cleaner',
        icon: '🧽',
        description: 'Recurring or one-off cleans with eco-friendly products and careful detail.'
      },
      {
        name: 'Carpet Cleaner',
        icon: '🧼',
        description: 'Hot-water extraction and stain treatments that revive carpets and rugs.'
      },
      {
        name: 'Window Cleaner',
        icon: '🪟',
        description: 'Interior and exterior window care using purified water systems.'
      },
      {
        name: 'Floor Polisher',
        icon: '✨',
        description: 'Professional polishing for hardwood, stone, and specialty flooring.'
      }
    ]
  },
  {
    id: 'electrical-smart-home',
    title: 'Electrical & Smart Home',
    blurb: 'Certified electricians and smart-home specialists keep your systems running.',
    services: [
      {
        name: 'Electrician',
        icon: '⚡',
        description: 'Consumer unit checks, rewiring, EV charger installs, and safety inspections.'
      },
      {
        name: 'CCTV & Smart Home',
        icon: '📹',
        description: 'Security cameras, smart lighting, thermostats, and whole-home automation.'
      }
    ]
  },
  {
    id: 'outdoor-garden',
    title: 'Outdoor & Garden',
    blurb: 'Exterior specialists who protect kerb appeal and keep outdoor spaces tidy.',
    services: [
      {
        name: 'Gardener',
        icon: '🌿',
        description: 'Seasonal tidy-ups, lawn care, planting, and biodiversity-friendly maintenance.'
      },
      {
        name: 'Roof Cleaner',
        icon: '🧗',
        description: 'Safe moss removal, soft washing, and gutter line treatments for every roof type.'
      },
      {
        name: 'Gutter Repair',
        icon: '🪣',
        description: 'Repairs, realignments, and full replacements to keep drainage flowing.'
      }
    ]
  },
  {
    id: 'specialized-trades',
    title: 'Specialized Trades',
    blurb: 'Trade professionals ready for complex projects and regulated works.',
    services: [
      {
        name: 'Plumber',
        icon: '🚰',
        description: 'Emergency leaks, boiler care, bathroom installs, and heating upgrades.'
      },
      {
        name: 'Carpenter',
        icon: '🪚',
        description: 'Bespoke carpentry, storage builds, and structural repairs with precision.'
      },
      {
        name: 'Painter',
        icon: '🎨',
        description: 'Interior and exterior finishes with colour consultations and tidy execution.'
      },
      {
        name: 'Welder',
        icon: '⚙️',
        description: 'On-site welding, metal fabrication, and safety-certified repairs.'
      },
      {
        name: 'Pest Control',
        icon: '🐜',
        description: 'Rapid identification, humane treatments, and preventative monitoring.'
      },
      {
        name: 'Security & CCTV Installation',
        icon: '🛡️',
        description: 'Full perimeter coverage with monitored CCTV, alarms, and smart locks.'
      },
      {
        name: 'Flooring & Tiling',
        icon: '🧱',
        description: 'Precision tiling, hardwood installation, and acoustic underlay solutions.'
      },
      {
        name: 'Smart Home Automation',
        icon: '🏠',
        description: 'Lighting, climate, and security automation tailored to modern Irish homes.'
      }
    ]
  }
]

const contactOptions = [
  {
    title: 'Talk to support',
    description: 'Need help planning a job? Our Dublin-based team is on hand Monday to Saturday.',
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
      } finally {
        // no-op
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
        <section className="premium-hero" aria-labelledby="hero-heading">
          <div className="premium-hero__gradient" aria-hidden="true" />
          <div className="premium-hero__inner container">
            <div className="premium-hero__copy">
              <div className="premium-hero__brand" aria-label="FixEasy premium experience">
                <span className="premium-hero__mark" aria-hidden="true">
                  ƒ
                </span>
                <span className="premium-hero__name">FixEasy</span>
                <span className="premium-hero__pulse" aria-hidden="true" />
              </div>
              <h1 id="hero-heading">Ireland’s Trusted Platform for Home Services — Fast, Verified, and Secure.</h1>
              <p className="hero__summary">
                Book insured experts in minutes with proactive updates, encrypted communication, and compliance-ready
                documentation for every visit.
              </p>
              <div className="premium-hero__stats" role="list">
                {heroStats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="premium-hero__stat"
                    role="listitem"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.4 }}
                  >
                    <strong>{stat.label}</strong>
                    <span>{stat.description}</span>
                  </motion.div>
                ))}
              </div>
              <div className="premium-hero__actions" role="group" aria-label="Primary actions">
                <Link href="/register/client" className="premium-hero__cta premium-hero__cta--primary">
                  Book a Service
                </Link>
                <Link href="/register/pro" className="premium-hero__cta premium-hero__cta--secondary">
                  Join as Professional
                </Link>
              </div>
            </div>

            <div className="premium-hero__visual" aria-label="Why Ireland trusts FixEasy">
              <div className="premium-hero__card">
                <p className="premium-hero__tagline">
                  “Ireland’s Trusted Platform for Home Services — Fast, Verified, and Secure.”
                </p>
                <ul className="premium-hero__highlights">
                  <li>Over 1,200 verified tradespeople across Dublin.</li>
                  <li>Guaranteed same-day response on urgent requests.</li>
                </ul>
                <div className="trust-section" role="list" aria-label="FixEasy trust commitments">
                  {trustHighlights.map((item) => (
                    <div key={item.title} className="trust-section__card" role="listitem">
                      <h2>{item.title}</h2>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="services-section" id="services" aria-labelledby="services-heading">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Services</p>
              <h2 id="services-heading">Every service you need, grouped for easy booking</h2>
              <p className="section-summary">
                Select the category that fits your job and we will match you with insured, ID-verified professionals with the
                right skills and local coverage.
              </p>
            </div>
            <div className="services-groups">
              {serviceSections.map((group) => (
                <section key={group.id} className="services-group" aria-labelledby={`${group.id}-title`}>
                  <div className="services-group__intro">
                    <h3 id={`${group.id}-title`}>{group.title}</h3>
                    <p>{group.blurb}</p>
                  </div>
                  <div className="services-grid">
                    {group.services.map((service, index) => (
                      <Link
                        key={service.name}
                        href={{ pathname: '/register/client', query: { service: service.name } }}
                        className="service-card-link"
                      >
                        <motion.article
                          className="service-card"
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -6 }}
                          transition={{ duration: 0.35, delay: index * 0.05 }}
                          viewport={{ once: true, amount: 0.6 }}
                        >
                          <motion.span
                            className="service-card__icon"
                            aria-hidden="true"
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                          >
                            {service.icon}
                          </motion.span>
                          <div className="service-card__body">
                            <h4>{service.name}</h4>
                            <p>{service.description}</p>
                          </div>
                        </motion.article>
                      </Link>
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
              <p className="section-eyebrow">Book with confidence</p>
              <h2 id="cta-heading">Ready for your next repair or refresh?</h2>
              <p>
                Create a FixEasy account to track every visit, receive arrival notifications, and rebook your favourite pros in
                seconds.
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
            <div className="section-header">
              <p className="section-eyebrow">Contact</p>
              <h2 id="contact-heading">We are here when you need us</h2>
              <p className="section-summary">
                Reach out to the FixEasy team for booking support, partnership enquiries, or to check live platform status.
              </p>
            </div>
            <div className="contact-grid">
              {contactOptions.map((item) => (
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
