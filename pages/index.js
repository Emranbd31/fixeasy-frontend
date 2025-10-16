import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'

const heroSlides = [
  {
    image: 'https://images.pexels.com/photos/5853568/pexels-photo-5853568.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Plumber fixing a sink'
  },
  {
    image: 'https://images.pexels.com/photos/5922715/pexels-photo-5922715.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Electrician repairing ceiling lights'
  },
  {
    image: 'https://images.pexels.com/photos/5591510/pexels-photo-5591510.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Cleaner vacuuming an office'
  },
  {
    image: 'https://images.pexels.com/photos/5769370/pexels-photo-5769370.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Gardener trimming plants'
  },
  {
    image: 'https://images.pexels.com/photos/6474363/pexels-photo-6474363.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Painter refreshing a wall'
  },
  {
    image: 'https://images.pexels.com/photos/5973660/pexels-photo-5973660.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Carpenter crafting furniture'
  },
  {
    image: 'https://images.pexels.com/photos/6938728/pexels-photo-6938728.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Handyman fixing a door'
  },
  {
    image: 'https://images.pexels.com/photos/10947653/pexels-photo-10947653.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Roof cleaner working safely at height'
  },
  {
    image: 'https://images.pexels.com/photos/8467863/pexels-photo-8467863.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Carpet cleaner using professional equipment'
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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
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

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setIsReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)

    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference)
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
    if (isReducedMotion) return

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)

    return () => {
      clearInterval(slideInterval)
    }
  }, [isReducedMotion])

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
          <div className="hero__slides" aria-hidden="true">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.alt}
                className={`hero__slide ${index === currentSlide ? 'is-active' : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <span className="hero__slide-label">{slide.alt}</span>
              </div>
            ))}
          </div>
          <div className="hero__overlay" />
          <div className="hero__content container">
            <p className="hero__eyebrow">Trusted Home-Service Professionals Across Ireland</p>
            <h1 id="hero-heading">Book verified plumbers, electricians, cleaners, and more — all on one secure platform.</h1>
            <p className="hero__summary">
              FixEasy connects households and businesses with vetted experts for every trade, backed by live updates, secure
              payments, and a satisfaction guarantee.
            </p>
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
