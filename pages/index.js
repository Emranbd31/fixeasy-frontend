import Hero from '../components/Hero'
import Image from 'next/image'

const services = [
  {
    name: 'Plumbing Repair',
    icon: '/icons/plumbing.svg',
    image: '/images/plumber.jpg',
    description: 'Fix burst pipes, upgrade fixtures, and keep hot water flowing.',
    price: 'From €70',
    eta: 'Available within 2 hrs',
  },
  {
    name: 'Eco Cleaning',
    icon: '/icons/cleaning.svg',
    image: '/images/cleaner.jpg',
    description: 'Low-tox deep cleans using plant-based products for every room.',
    price: 'From €55',
    eta: 'Same-day slots near you',
  },
  {
    name: 'Electrical Safety',
    icon: '/icons/electrical.svg',
    image: '/images/electrician.jpg',
    description: 'Certified electricians for smart home installs and repairs.',
    price: 'From €90',
    eta: 'Emergency cover 24/7',
  },
  {
    name: 'Interior Painting',
    icon: '/icons/painting.svg',
    image: '/images/painter.jpg',
    description: 'Refresh rooms with durable, low-VOC finishes and clean edges.',
    price: 'From €120',
    eta: 'Book in under 3 mins',
  },
  {
    name: 'Garden Care',
    icon: '/icons/gardening.svg',
    image: '/images/gardener.jpg',
    description: 'Seasonal tidy-ups, lawn care, and eco-friendly landscaping.',
    price: 'From €65',
    eta: 'Professionals rated 4.9★',
  },
  {
    name: 'Moving Help',
    icon: '/icons/moving.svg',
    image: '/images/moving.jpg',
    description: 'Reliable hands for packing, lifting, and smooth move days.',
    price: 'From €80',
    eta: 'Transparent hourly rates',
  },
]

const stats = [
  { value: '24k+', label: 'Home jobs completed' },
  { value: '4.9/5', label: 'Average customer rating' },
  { value: '320+', label: 'Screened local experts' },
]

const steps = [
  {
    title: 'Tell us what you need',
    copy: 'Share your location, project details, and preferred times in seconds.',
  },
  {
    title: 'Compare verified pros',
    copy: 'Browse green-rated experts, see upfront prices, and select your favourite.',
  },
  {
    title: 'Track every milestone',
    copy: 'Stay updated from arrival to wrap-up with in-app messaging and status alerts.',
  },
]

const testimonials = [
  {
    quote: 'Our leaky boiler was sorted before lunch. Transparent pricing and brilliant communication.',
    name: 'Niamh, Dublin 8',
  },
  {
    quote: 'Booked an eco clean and the team used products that were safe for our twins and pets.',
    name: 'Aisling, Galway',
  },
]

export default function Home() {
  return (
    <div>
      <Hero />

      <section className="section section--muted">
        <div className="container trust">
          <div className="trust__intro">
            <span className="section__eyebrow">Trusted across Ireland</span>
            <h2 className="section__title">FixEasy keeps homes running smoothly</h2>
            <p className="section__description">
              From urgent repairs to weekend refreshes, Ireland&apos;s households choose FixEasy to
              book insured, sustainability-led professionals with total peace of mind.
            </p>
          </div>
          <div className="stats">
            {stats.map((item) => (
              <article key={item.label} className="stats__item">
                <span>{item.value}</span>
                <p>{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section__heading">
            <span className="section__eyebrow">Popular services</span>
            <h2 className="section__title">Handpicked experts for every project</h2>
            <p className="section__description">
              Browse curated categories with real-time availability, verified credentials, and
              eco-first standards built in.
            </p>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.name}>
                <div className="service-card__media">
                  <Image src={service.image} alt={service.name} fill priority sizes="(min-width: 768px) 280px, 100vw" />
                  <span className="service-card__badge">
                    <Image src={service.icon} alt="" width={20} height={20} />
                    <span>{service.price}</span>
                  </span>
                </div>
                <div className="service-card__body">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-card__meta">{service.eta}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container steps">
          <div className="section__heading">
            <span className="section__eyebrow">How it works</span>
            <h2 className="section__title">Book smarter in three effortless steps</h2>
            <p className="section__description">
              Designed to remove the back-and-forth. FixEasy keeps every stage transparent and
              trackable, whether it&apos;s a quick fix or a full renovation.
            </p>
          </div>
          <ol className="steps__list">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="steps__number">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <div className="section__heading">
            <span className="section__eyebrow">Customer stories</span>
            <h2 className="section__title">Ireland&apos;s households love the FixEasy experience</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <blockquote key={item.name}>
                <p>“{item.quote}”</p>
                <footer>— {item.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cta">
        <div className="container section--cta__inner">
          <div>
            <span className="section__eyebrow">Ready when you are</span>
            <h2 className="section__title">Let&apos;s get your next home job booked</h2>
            <p className="section__description">
              Answer a few quick questions and get matched with a verified professional in
              minutes. No guesswork, no stress—just great work.
            </p>
          </div>
          <div className="cta-actions">
            <a className="hero__cta" href="/book">
              Book a service
            </a>
            <a className="hero__secondary" href="#services">
              Explore categories
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">© {new Date().getFullYear()} FixEasy Ireland. All rights reserved.</footer>
    </div>
  )
}
