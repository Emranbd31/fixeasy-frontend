import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'

const heroGallery = [
  {
    image:
      'https://images.unsplash.com/photo-1704741038104-cb122baec7b1?auto=format&fit=crop&w=1200&q=80',
    alt: 'AI generated tradesperson installing smart lighting'
  },
  {
    image:
      'https://images.unsplash.com/photo-1705092181164-68a8c806dd62?auto=format&fit=crop&w=800&q=80',
    alt: 'AI generated professional cleaner preparing eco products'
  },
  {
    image:
      'https://images.unsplash.com/photo-1704740770411-82466e0e5c5e?auto=format&fit=crop&w=800&q=80',
    alt: 'AI generated handyman talking with a happy customer'
  }
]

const heroHighlights = [
  {
    title: 'Ireland-wide trusted pros',
    description: 'Background-checked experts ready for urgent fixes and planned projects.'
  },
  {
    title: 'One request, smart matching',
    description: 'Share the details once and our platform connects you with the best-fit specialist.'
  },
  {
    title: 'Clear quotes, live tracking',
    description: 'Approve pricing, chat with your pro, and follow every milestone in one place.'
  }
]

const trustMetrics = [
  { value: '★ 4.9/5', label: 'Customer rating' },
  { value: '500+', label: 'Verified professionals' },
  { value: '12,000+', label: 'Jobs completed' }
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

  const isLoggedIn = useMemo(() => Boolean(userRole), [userRole])
  const dashboardHref = useMemo(() => {
    if (!userRole) return '/admin'
    if (userRole === 'pro') return '/admin?view=pro'
    if (userRole === 'client') return '/admin?view=client'
    return '/admin'
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
                <Link href="/admin" className="nav-btn nav-btn--ghost">
                  Login
                </Link>
                <Link href="/register/client" className="nav-btn nav-btn--primary">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="homepage-hero" aria-labelledby="hero-heading">
          <div className="container hero-modern">
            <div className="hero-modern__copy">
              <p className="hero__eyebrow">Ireland's home-service concierge</p>
              <h1 id="hero-heading" className="hero-modern__headline">
                Your fastest route to reliable trades and tidy homes
              </h1>
              <p className="hero-modern__summary">
                Match with insured tradespeople, coordinate visits, and keep every task moving with real-time updates and
                secure payments handled by FixEasy.
              </p>
              <ul className="hero-modern__highlights">
                {heroHighlights.map((item) => (
                  <li key={item.title}>
                    <span aria-hidden="true" className="hero-modern__tick">
                      ✓
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="hero__actions" role="group" aria-label="Primary calls to action">
                <Link href="/register/client" className="hero__cta hero__cta--primary">
                  Book a Service
                </Link>
                <Link href="/register/pro" className="hero__cta hero__cta--secondary">
                  Join as Professional
                </Link>
              </div>
              <div className="hero__trust">
                {trustMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="hero__trust-item"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="hero-modern__media" aria-hidden="true">
              <div className="hero-modern__card">
                <img
                  src={heroGallery[0].image}
                  alt=""
                  className="hero-modern__card-image"
                  loading="lazy"
                />
                <div className="hero-modern__card-body">
                  <span className="hero-modern__badge">FixEasy is rated Excellent</span>
                  <div className="hero-modern__rating">
                    <span className="hero-modern__stars" aria-hidden="true">
                      ★★★★★
                    </span>
                    <p>
                      TrustScore 4.9 · 1,800+ reviews
                      <span className="sr-only"> on TrustPilot</span>
                    </p>
                  </div>
                  <blockquote>
                    “Bookings were confirmed in minutes and the work quality was outstanding. I recommend FixEasy to every
                    property manager I know.”
                  </blockquote>
                  <footer>Aoife, Facilities Lead in Dublin</footer>
                </div>
              </div>
              <div className="hero-modern__gallery">
                {heroGallery.slice(1).map((shot) => (
                  <figure key={shot.alt} className="hero-modern__shot">
                    <img src={shot.image} alt={shot.alt} loading="lazy" />
                    <figcaption>{shot.alt}</figcaption>
                  </figure>
                ))}
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
                    {group.services.map((service) => (
                      <article key={service.name} className="service-card">
                        <span className="service-card__icon" aria-hidden="true">
                          {service.icon}
                        </span>
                        <div className="service-card__body">
                          <h4>{service.name}</h4>
                          <p>{service.description}</p>
                        </div>
                      </article>
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
