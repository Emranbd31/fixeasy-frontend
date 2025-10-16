import Head from 'next/head'
import Image from 'next/image'
import Hero from '../components/Hero'

const serviceCategories = [
  {
    name: 'Plumbing fixes',
    icon: '/icons/plumbing.svg',
    description: 'Emergency callouts, leak repair, cylinder installs, eco upgrades.'
  },
  {
    name: 'Home cleaning',
    icon: '/icons/cleaning.svg',
    description: 'Recurring cleans, deep sanitation, move-in ready services.'
  },
  {
    name: 'Electrical care',
    icon: '/icons/electrical.svg',
    description: 'Fuse board checks, EV charger installs, appliance fitting.'
  },
  {
    name: 'Interior painting',
    icon: '/icons/painting.svg',
    description: 'Colour consultations, low-VOC refreshes, exterior touch-ups.'
  },
  {
    name: 'Garden & outdoor',
    icon: '/icons/gardening.svg',
    description: 'Seasonal tidy ups, lawn care, power washing, compost setup.'
  },
  {
    name: 'Moving assistance',
    icon: '/icons/moving.svg',
    description: 'Packing pros, furniture assembly, storage runs, donation drops.'
  }
]

const featureHighlights = [
  {
    title: 'Zero surprises pricing',
    description:
      'Smart quoting blends travel time, eco materials, and live availability so you only pay for verified work.',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M16 3.5C9.1 3.5 3.5 9.1 3.5 16S9.1 28.5 16 28.5 28.5 22.9 28.5 16 22.9 3.5 16 3.5zm0 22C10.8 25.5 6.5 21.2 6.5 16S10.8 6.5 16 6.5 25.5 10.8 25.5 16 21.2 25.5 16 25.5z"
          fill="currentColor"
        />
        <path
          d="M16 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1.2 12.2h-2.4c-.7 0-1.3-.6-1.3-1.3v-.4c0-.7.6-1.3 1.3-1.3h.2c1.2 0 2.1-.7 2.1-1.6s-.9-1.6-2.1-1.6c-1.9 0-3.4-1.4-3.4-3.1v-.3c0-.7.6-1.3 1.3-1.3h4.8c.7 0 1.3.6 1.3 1.3v.4c0 .7-.6 1.3-1.3 1.3h-1.7c1 .6 1.7 1.6 1.7 2.8 0 1.5-1 2.8-2.5 3.3h.3c.7 0 1.3.6 1.3 1.3v.4c0 .7-.6 1.3-1.3 1.3z"
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    title: 'Vetted pros with smart guardrails',
    description:
      'Background checks, live insurance, MFA-protected logins, and device checks keep every visit accountable.',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M16 3.5 5.1 8.6c-.6.3-.9.9-.9 1.5v4.4c0 6.1 4.1 11.7 9.9 13.3.4.1.8.1 1.2 0 5.8-1.6 9.9-7.2 9.9-13.3v-4.4c0-.6-.3-1.1-.9-1.5L16 3.5zM24 14.5c0 5-3.3 9.6-8 11-4.7-1.4-8-6-8-11v-3.6L16 6.4l8 4.5v3.6z"
          fill="currentColor"
        />
        <path
          d="M14.5 18.2 12.6 16l1.4-1.4 1.3 1.5 4.1-4.1 1.4 1.4-5.5 5.5-1.8-1.7z"
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    title: 'Sustainable by default',
    description:
      'Track carbon offsets, low-VOC products, and waste recovery directly in your booking timeline.',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M20.8 4.5c-2.4 0-4.7 1-6.3 2.7-1.6-1.7-3.9-2.7-6.3-2.7-4.8 0-8.7 3.9-8.7 8.7 0 4.1 2.9 7.6 6.9 8.5 2.5 5.3 7.1 8.3 8.1 8.9.2.1.4.2.6.2s.4-.1.6-.2c1-.6 5.6-3.6 8.1-8.9 4-1 6.9-4.5 6.9-8.5 0-4.8-3.9-8.7-8.7-8.7zm-6.3 20.8c-1.3-1-3.8-3.2-5.4-6.6-.2-.5-.6-.8-1.2-.9-3-.4-5.1-2.8-5.1-5.7 0-3.2 2.6-5.7 5.7-5.7 2.1 0 4 .9 5.1 2.6.4.6 1.4.6 1.8 0 1.1-1.7 3-2.6 5.1-2.6 3.2 0 5.7 2.6 5.7 5.7 0 2.9-2.1 5.3-5.1 5.7-.5.1-1 .4-1.2.9-1.7 3.4-4.1 5.6-5.4 6.6z"
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    title: 'Real-time updates & support',
    description:
      'Track arrivals, chat with your pro, and access invoices or photos in a single, secure feed.',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M27 5.5H5c-1.7 0-3 1.3-3 3v10c0 1.7 1.3 3 3 3h4v4.7c0 .4.3.8.8.8.2 0 .3 0 .4-.2l6.7-5.3H27c1.7 0 3-1.3 3-3v-10c0-1.7-1.3-3-3-3zm0 13H15.7c-.3 0-.6.1-.8.3l-4.4 3.5v-2.8H5c-.6 0-1-.4-1-1v-10c0-.6.4-1 1-1h22c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1z"
          fill="currentColor"
        />
      </svg>
    )
  }
]

const processSteps = [
  {
    title: 'Share the job',
    description: 'Tell us what needs attention, attach photos, and pick a green-friendly slot.',
    bullets: ['Instant quote in seconds', 'Carbon impact estimate included', 'Secure card on hold only when you approve']
  },
  {
    title: 'Match with a pro',
    description: 'We route to vetted FixEasy partners with the right credentials and nearby availability.',
    bullets: ['Identity + insurance verified on every login', 'Live GPS + ETA notifications', 'Device posture checks for work photos']
  },
  {
    title: 'Track to done',
    description: 'Chat, approve extras, view eco materials, and rate the finish — all in one timeline.',
    bullets: ['Two-way messaging & instant translation', 'Auto-synced invoices and warranties', 'Satisfaction guarantee with rapid rebook']
  }
]

const testimonialStories = [
  {
    quote: '“Our renovation punch list was handled across plumbing, electrical and painting in a single weekend.”',
    name: 'Liam • Dublin 4',
    role: 'Facilities manager, boutique hotel',
    rating: 5
  },
  {
    quote: '“The live updates meant we could coordinate deliveries without missing a beat. The team even offset the fuel.”',
    name: 'Aoife • Galway',
    role: 'Operations lead, co-working hub',
    rating: 5
  },
  {
    quote: '“FixEasy pros always arrive with low-VOC products ready. Our office air quality has never been better.”',
    name: 'Niamh • Cork',
    role: 'People ops, scale-up',
    rating: 5
  }
]

const trustMetrics = [
  {
    value: '4.9/5',
    label: 'Average rating',
    detail: 'Across 12k verified visits'
  },
  {
    value: '18 min',
    label: 'Median response',
    detail: 'From request to pro match'
  },
  {
    value: '98%',
    label: 'Jobs finished first visit',
    detail: 'Thanks to proactive prep'
  },
  {
    value: '74%',
    label: 'Eco upgrades chosen',
    detail: 'Clients picking low-impact options'
  }
]

export default function Home(){
  return (
    <>
      <Head>
        <title>FixEasy | Modern home services for Irish households and teams</title>
        <meta
          name="description"
          content="Book trusted FixEasy professionals for repairs, cleaning, and projects with instant pricing, secure payments, and greener outcomes across Ireland."
        />
      </Head>

      <div className="landing">
        <Hero />

        <main>
          <section className="section section--metrics" aria-labelledby="metrics">
            <div className="container">
              <div className="section__header">
                <span className="section__eyebrow">Why households and teams choose FixEasy</span>
                <h2 className="section__title" id="metrics">Numbers that prove the difference</h2>
                <p className="section__description">
                  We combine zero-trust security, sustainable practices, and rapid response pros to deliver an end-to-end experience you can rely on.
                </p>
              </div>
              <div className="metrics__grid">
                {trustMetrics.map((metric) => (
                  <article key={metric.label} className="metric-card">
                    <h3>{metric.value}</h3>
                    <p className="metric-card__label">{metric.label}</p>
                    <p className="metric-card__detail">{metric.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section" id="services" aria-labelledby="services-title">
            <div className="container">
              <div className="section__header">
                <span className="section__eyebrow">All the help you need</span>
                <h2 className="section__title" id="services-title">Modular home & workplace services</h2>
                <p className="section__description">
                  Mix and match categories, add-ons, and eco-upgrades. Every booking includes digital checklists, before/after media, and tracked emissions savings.
                </p>
              </div>
              <div className="services-grid">
                {serviceCategories.map((service) => (
                  <article key={service.name} className="service-card">
                    <div className="service-card__icon" aria-hidden="true">
                      <Image src={service.icon} width={56} height={56} alt="" />
                    </div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <a href="/book" className="service-card__link">Get instant pricing</a>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section--tint" id="why-fixeasy" aria-labelledby="feature-title">
            <div className="container">
              <div className="section__header">
                <span className="section__eyebrow">Confidence in every visit</span>
                <h2 className="section__title" id="feature-title">Built with enterprise-grade guardrails</h2>
                <p className="section__description">
                  FixEasy blends residential simplicity with commercial rigour — from onboarding to payout you have visibility, audit trails, and human support.
                </p>
              </div>
              <div className="feature-grid">
                {featureHighlights.map((feature) => (
                  <article key={feature.title} className="feature-card">
                    <span className="feature-card__icon">{feature.icon}</span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section" id="how-it-works" aria-labelledby="process-title">
            <div className="container">
              <div className="section__header">
                <span className="section__eyebrow">How it works</span>
                <h2 className="section__title" id="process-title">From request to wrap in three easy stages</h2>
                <p className="section__description">
                  Whether you manage a property portfolio or just need a same-day fix, our workflow keeps everything aligned and documented.
                </p>
              </div>
              <div className="process-grid">
                {processSteps.map((step, index) => (
                  <article key={step.title} className="process-step">
                    <span className="process-step__number">0{index + 1}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <ul>
                      {step.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section--split" id="sustainability" aria-labelledby="sustainability-title">
            <div className="container">
              <div className="section__split">
                <div className="section__split-content">
                  <span className="section__eyebrow">Security & sustainability</span>
                  <h2 className="section__title" id="sustainability-title">Zero-trust controls meet greener operations</h2>
                  <p className="section__description">
                    All sessions are MFA-protected, every action emits an audit trail, and eco-tracking is surfaced per booking so you can report confidently.
                  </p>
                  <ul className="split-list">
                    <li>
                      <strong>Hybrid zero-trust</strong>
                      <span>Role-based portals, device posture checks, and signed webhooks keep data in the right hands.</span>
                    </li>
                    <li>
                      <strong>GDPR by design</strong>
                      <span>RLS-secured Postgres, automated retention policies, and export/delete tooling built-in.</span>
                    </li>
                    <li>
                      <strong>Climate positive options</strong>
                      <span>Choose electric transport, low-VOC supplies, and local pros to cut travel emissions.</span>
                    </li>
                  </ul>
                </div>
                <div className="section__split-panel" role="presentation">
                  <div className="insight-card">
                    <header>
                      <span>Live compliance feed</span>
                      <strong>Device posture</strong>
                    </header>
                    <ul>
                      <li>
                        <span className="status status--pass" aria-hidden="true"></span>
                        Stripe webhooks verified <time dateTime="2024-03-12">12 Mar</time>
                      </li>
                      <li>
                        <span className="status status--pass" aria-hidden="true"></span>
                        SSO session renewed <time dateTime="2024-03-14T09:30">09:30</time>
                      </li>
                      <li>
                        <span className="status status--warn" aria-hidden="true"></span>
                        New device approval pending
                      </li>
                    </ul>
                    <footer>
                      <small>Automated alerts & runbooks on every event.</small>
                    </footer>
                  </div>
                  <div className="insight-card insight-card--secondary">
                    <header>
                      <span>Eco impact</span>
                      <strong>This week</strong>
                    </header>
                    <ul>
                      <li>
                        <span>🚲</span>
                        68% of jobs completed via low-emission transport
                      </li>
                      <li>
                        <span>🌱</span>
                        214kg CO₂ offset through FixEasy green funds
                      </li>
                      <li>
                        <span>🧴</span>
                        92% of supplies verified low-VOC or refillable
                      </li>
                    </ul>
                    <footer>
                      <small>Shareable sustainability receipts accompany every invoice.</small>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section section--tint" id="testimonials" aria-labelledby="testimonials-title">
            <div className="container">
              <div className="section__header">
                <span className="section__eyebrow">Loved by clients across Ireland</span>
                <h2 className="section__title" id="testimonials-title">Real stories from FixEasy members</h2>
                <p className="section__description">
                  From Dublin apartments to Galway co-working spaces, FixEasy keeps operations humming with proactive support.
                </p>
              </div>
              <div className="testimonials-grid">
                {testimonialStories.map((story) => (
                  <article key={story.name} className="testimonial-card">
                    <p className="testimonial-card__quote">{story.quote}</p>
                    <div className="testimonial-card__rating" aria-label={`${story.rating} out of 5 stars`}>
                      {Array.from({ length: story.rating }).map((_, starIndex) => (
                        <span key={starIndex} aria-hidden="true">★</span>
                      ))}
                    </div>
                    <p className="testimonial-card__name">{story.name}</p>
                    <p className="testimonial-card__role">{story.role}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section--cta" aria-labelledby="cta-title">
            <div className="container">
              <div className="cta-banner">
                <div className="cta-banner__content">
                  <span className="section__eyebrow">Ready when you are</span>
                  <h2 className="section__title" id="cta-title">Book a trusted FixEasy pro in under two minutes</h2>
                  <p className="section__description">
                    Create your booking, invite teammates, and manage every task from one secure dashboard.
                  </p>
                </div>
                <div className="cta-banner__actions">
                  <a className="hero__cta" href="/book">Start a booking</a>
                  <a className="hero__secondary" href="mailto:hello@fixeasy.ie">Talk to our team</a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">© {new Date().getFullYear()} FixEasy Ireland • Built for secure, sustainable service ops</footer>
      </div>
    </>
  )
}
