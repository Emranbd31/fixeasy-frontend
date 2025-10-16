import Hero from '../components/Hero'
import Image from 'next/image'

const services = [
  /* Codex Redesign v1 */
  { name: 'Plumbing', icon: '/icons/plumbing.svg', blurb: 'Rapid leak fixes, installations, and full bathroom care.' },
  { name: 'Cleaning', icon: '/icons/cleaning.svg', blurb: 'Eco-friendly deep cleans, end-of-lease refreshes, and upkeep.' },
  { name: 'Electrical', icon: '/icons/electrical.svg', blurb: 'Certified electricians for diagnostics, rewiring, and safety.' },
  { name: 'Painting', icon: '/icons/painting.svg', blurb: 'Interior and exterior finishes with meticulous prep and detail.' },
  { name: 'Gardening', icon: '/icons/gardening.svg', blurb: 'Seasonal tidy-ups, landscaping support, and lawn maintenance.' },
  { name: 'Moving Help', icon: '/icons/moving.svg', blurb: 'Packing, heavy lifting, and setup for a seamless move-in.' },
]

export default function Home(){
  return (
    <div>
      <Hero />
      <main className="container">
        {/* Codex Redesign v1 */}
        <section className="service-showcase">
          {/* Codex Redesign v1 */}
          <div className="service-showcase__header">
            <span>Explore services</span>
            <h2>Popular home requests booked this week</h2>
            <p>Every professional is pre-vetted, insured, and ready with sustainable materials tailored to your home.</p>
          </div>
          {/* Codex Redesign v1 */}
          <div className="service-grid">
            {services.map(service => (
              <article className="service-card" key={service.name}>
                {/* Codex Redesign v1 */}
                <div className="service-card__icon">
                  <Image src={service.icon} width={56} height={56} alt={service.name} />
                </div>
                <div className="service-card__body">
                  <h3>{service.name}</h3>
                  <p>{service.blurb}</p>
                </div>
                <div className="service-card__meta">
                  <span className="badge">Verified</span>
                </div>
              </article>
            ))}
          </div>
        </section>
        {/* Codex Redesign v1 */}
        <section className="insight-section">
          <div className="insight-card">
            {/* Codex Redesign v1 */}
            <span className="insight-eyebrow">Live Booking Board</span>
            <ul>
              <li><strong>Emergency plumbing</strong> • Booked 12 minutes ago in Cork City</li>
              <li><strong>Deep cleaning</strong> • Confirmed for Friday 09:00 in Dublin 4</li>
              <li><strong>Electrical safety check</strong> • Scheduled Monday 14:30 in Galway</li>
            </ul>
          </div>
          <div className="insight-card">
            {/* Codex Redesign v1 */}
            <span className="insight-eyebrow">Customer Spotlight</span>
            <p>“Our FixEasy electrician arrived with a smile, solved the issue fast, and shared tips to save energy. Couldn’t recommend more.”</p>
            <span className="spotlight-meta">— Saoirse, Dublin 8</span>
          </div>
        </section>
      </main>
      <footer className="footer">© {new Date().getFullYear()} FixEasy Ireland</footer>
    </div>
  )
}
