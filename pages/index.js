import Head from 'next/head'
import Image from 'next/image'
import Hero from '../components/Hero'

const stats = [
  { value: '4.9/5', label: 'Average rating', detail: 'Across 12k verified visits' },
  { value: '18 min', label: 'Median response time', detail: 'To confirm a new request' },
  { value: '98%', label: 'First-visit resolution', detail: 'Backed by proactive prep' },
  { value: '74%', label: 'Eco options chosen', detail: 'Clients selecting greener add-ons' }
]

const services = [
  {
    name: 'Plumbing & heating',
    icon: '/icons/plumbing.svg',
    description: 'Emergency repairs, boiler servicing, smart thermostat installs, and leak investigations.'
  },
  {
    name: 'Home & office cleaning',
    icon: '/icons/cleaning.svg',
    description: 'Recurring and deep cleans with vetted teams, air-quality friendly products, and carbon tracking.'
  },
  {
    name: 'Electrical upgrades',
    icon: '/icons/electrical.svg',
    description: 'Consumer unit checks, EV charger installs, lighting design, and appliance fitting.'
  },
  {
    name: 'Painting & finishing',
    icon: '/icons/painting.svg',
    description: 'Low-VOC refreshes, wallpaper care, exterior touch-ups, and snag list close-outs.'
  },
  {
    name: 'Garden & outdoor',
    icon: '/icons/gardening.svg',
    description: 'Seasonal tidy ups, lawn care, power washing, compost setup, and biodiversity support.'
  },
  {
    name: 'Move & setup support',
    icon: '/icons/moving.svg',
    description: 'Packing pros, furniture assembly, storage runs, and handover-ready space planning.'
  }
]

const journeySteps = [
  {
    title: 'Share the brief',
    description:
      'Add photos, select your slot, and choose greener material preferences so we can price accurately from the outset.',
    bullets: ['Instant quoting with price transparency', 'Secure card hold once you approve the plan']
  },
  {
    title: 'Match with a verified pro',
    description:
      'FixEasy routes the job to specialists with the right credentials, insurance, and proximity for your request.',
    bullets: ['Identity and insurance checks on every login', 'Live ETA, chat, and change approvals in one timeline']
  },
  {
    title: 'Track through completion',
    description:
      'Follow progress, receive photos and invoices, and log feedback — all with a full audit trail for your records.',
    bullets: ['Sustainability receipts and materials logged', 'One-click rebook or escalation support if needed']
  }
]

const trustHighlights = [
  {
    title: 'Zero-trust access controls',
    description:
      'Role-based and attribute-based permissions protect client, pro, and admin experiences across every workflow.'
  },
  {
    title: 'Observability baked in',
    description:
      'Structured logs, traces, and live dashboards surface booking health, SLA breaches, and device posture changes.'
  },
  {
    title: 'Data residency & privacy',
    description:
      'GDPR-friendly defaults with minimised PII, encryption in transit and at rest, and self-serve data requests.'
  }
]

const securityPractices = [
  'Cloudflare WAF, Turnstile, and geo-fencing across every public entry point',
  'Supabase Row Level Security with tenant, role, and device scoping',
  'Short-lived JWTs with rotation, signed Stripe webhooks, and audit logs for sensitive actions',
  'MFA for clients and pros, device posture checks, and session binding for peace of mind'
]

const testimonials = [
  {
    quote: '“We cleared a renovation punch list across plumbing, electrical, and painting in one coordinated weekend.”',
    name: 'Liam, Facilities Manager',
    location: 'Dublin 4'
  },
  {
    quote: '“The live updates meant deliveries were timed perfectly. The team even offset the transport footprint.”',
    name: 'Aoife, Operations Lead',
    location: 'Galway'
  },
  {
    quote: '“FixEasy crews arrive with low-VOC products ready to go. Our office air quality has never been better.”',
    name: 'Niamh, People Ops',
    location: 'Cork'
  }
]

const onboardingPaths = [
  {
    title: 'Client registration',
    description:
      'Set up a secure FixEasy account with MFA, document verification, and concierge-level scheduling preferences.',
    link: '/register/client',
    action: 'Register as a client'
  },
  {
    title: 'Professional onboarding',
    description:
      'Submit Irish identity, insurance, and tax documents to access verified jobs, routing, and instant payouts.',
    link: '/register/pro',
    action: 'Join as a pro'
  }
]

export default function Home() {
  return (
    <div className="landing">
      <Head>
        <title>FixEasy — Trusted property care for homes and workplaces</title>
        <meta
          name="description"
          content="Book vetted professionals for repairs, installs, and cleaning with instant quotes, secure payments, and greener operations."
        />
      </Head>

      <Hero />

      <main>
        <section className="section section--light" id="metrics">
          <div className="container">
            <div className="section__header">
              <p className="section__eyebrow">Why FixEasy</p>
              <h2 className="section__title">Proven delivery and delighted clients</h2>
              <p className="section__description">
                Every FixEasy visit blends rigorous screening, precise scheduling, and sustainability measures so you stay on
                top of your property portfolio without the busywork.
              </p>
            </div>

            <div className="metrics__grid">
              {stats.map((item) => (
                <article key={item.label} className="metric-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="container">
            <div className="section__header">
              <p className="section__eyebrow">Services</p>
              <h2 className="section__title">One partner for every fix</h2>
              <p className="section__description">
                From reactive emergencies to planned upgrades, FixEasy professionals bring the right skills, tooling, and
                greener materials for the job.
              </p>
            </div>

            <div className="services__grid">
              {services.map((service) => (
                <article key={service.name} className="service-card">
                  <div className="service-card__icon" aria-hidden="true">
                    <Image src={service.icon} alt="" width={48} height={48} />
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--split" id="how-it-works">
          <div className="container">
            <div className="section__header">
              <p className="section__eyebrow">How it works</p>
              <h2 className="section__title">Transparent from booking to sign-off</h2>
              <p className="section__description">
                FixEasy orchestrates every step with live notifications, approvals, and sustainability tracking so you always
                know what is happening next.
              </p>
            </div>

            <div className="journey">
              {journeySteps.map((step) => (
                <article key={step.title} className="journey-card">
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

        <section className="section" id="trust">
          <div className="container trust">
            <div className="trust__intro">
              <p className="section__eyebrow">Security & compliance</p>
              <h2 className="section__title">Enterprise-grade protection for every visit</h2>
              <p className="section__description">
                FixEasy combines perimeter defence, zero-trust controls, and privacy-by-design tooling so facilities teams and
                households can collaborate with confidence.
              </p>

              <ul className="trust__list">
                {securityPractices.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="trust__cards">
              {trustHighlights.map((item) => (
                <article key={item.title} className="trust-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--tint" id="testimonials">
          <div className="container">
            <div className="section__header">
              <p className="section__eyebrow">Testimonials</p>
              <h2 className="section__title">Loved by operations and workplace teams</h2>
              <p className="section__description">
                Hear from clients who rely on FixEasy for responsive maintenance, transparent comms, and sustainability-first
                delivery.
              </p>
            </div>

            <div className="testimonials">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.quote} className="testimonial">
                  <blockquote>{testimonial.quote}</blockquote>
                  <figcaption>
                    {testimonial.name}
                    <span>{testimonial.location}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="onboarding">
          <div className="container">
            <div className="section__header">
              <p className="section__eyebrow">Onboarding</p>
              <h2 className="section__title">Ready when you are</h2>
              <p className="section__description">
                Whether you are booking trusted help or bringing your crew onto the FixEasy platform, our onboarding flows
                guide you through the Irish compliance requirements step by step.
              </p>
            </div>

            <div className="services__grid services__grid--onboarding">
              {onboardingPaths.map((path) => (
                <article key={path.title} className="service-card service-card--onboarding">
                  <h3>{path.title}</h3>
                  <p>{path.description}</p>
                  <a className="service-card__link" href={path.link}>
                    {path.action}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--cta" id="cta">
          <div className="container">
            <div className="cta">
              <div>
                <p className="section__eyebrow">Get started</p>
                <h2 className="section__title">Ready to delight residents and teams?</h2>
                <p className="section__description">
                  Launch FixEasy in under a day with secure onboarding, SSO-ready authentication, and guided pro matching.
                </p>
              </div>
              <div className="cta__actions" role="group" aria-label="Call to action">
                <a href="/book" className="cta__primary">
                  Book a walkthrough
                </a>
                <a href="mailto:hello@fixeasy.ie" className="cta__secondary">
                  Talk to sales
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <span className="hero__mark" aria-hidden="true">
              ƒ
            </span>
            <span className="footer__brand">FixEasy</span>
          </div>
          <nav aria-label="Legal links" className="footer__links">
            <a href="/terms">Terms &amp; Conditions</a>
            <a href="/privacy">Privacy Policy</a>
          </nav>
          <p>© {new Date().getFullYear()} FixEasy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
