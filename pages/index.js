import Hero from '../components/Hero'

const serviceIcons = {
  plumbing: (
    <svg viewBox='0 0 64 64' role='presentation' focusable='false'>
      <rect width='64' height='64' rx='18' fill='#e0f2fe' />
      <path
        fill='#0284c7'
        d='M40 16h-4v8h-8v-8h-4v12h4v20h8V28h4V16z'
      />
      <path
        fill='#38bdf8'
        d='M24 44h16v4H24z'
      />
    </svg>
  ),
  cleaning: (
    <svg viewBox='0 0 64 64' role='presentation' focusable='false'>
      <rect width='64' height='64' rx='18' fill='#dcfce7' />
      <path
        fill='#16a34a'
        d='M42 14h-9l-2 5h3v7h-2l-5 22c-.7 3 1.7 6 4.6 6h12.8c2.9 0 5.3-3 4.6-6L43 26h-3v-7h3l-1-5z'
      />
      <path fill='#bbf7d0' d='M31 26h6l3.2 18H27.8z' />
      <circle cx='24' cy='20' r='4' fill='#4ade80' opacity='0.75' />
    </svg>
  ),
  electrical: (
    <svg viewBox='0 0 64 64' role='presentation' focusable='false'>
      <rect width='64' height='64' rx='18' fill='#fef3c7' />
      <path
        fill='#f97316'
        d='M36 12 20 36h10v16l16-24H36V12z'
      />
    </svg>
  ),
  painting: (
    <svg viewBox='0 0 64 64' role='presentation' focusable='false'>
      <rect width='64' height='64' rx='18' fill='#ede9fe' />
      <path
        fill='#7c3aed'
        d='M24 14h16l4 10-12 12-12-12 4-10zm4 32 4 8 4-8h-8z'
      />
    </svg>
  ),
  gardening: (
    <svg viewBox='0 0 64 64' role='presentation' focusable='false'>
      <rect width='64' height='64' rx='18' fill='#dcfce7' />
      <path
        fill='#15803d'
        d='M32 12c-6 6-11 12-11 18 0 6 5 11 11 11s11-5 11-11c0-6-5-12-11-18zm0 20c-2.2 0-4-1.8-4-4 0-.5.1-1 .2-1.4l3.8-6.2 3.8 6.2c.2.4.2.9.2 1.4 0 2.2-1.8 4-4 4z'
      />
      <path fill='#4ade80' d='M28 46h8v6h-8z' />
    </svg>
  ),
  moving: (
    <svg viewBox='0 0 64 64' role='presentation' focusable='false'>
      <rect width='64' height='64' rx='18' fill='#e2e8f0' />
      <path
        fill='#1e293b'
        d='M20 20h18l10 10v14h-4a6 6 0 1 1-12 0h-8a6 6 0 1 1-12 0h-4V24a4 4 0 0 1 4-4z'
      />
      <circle cx='24' cy='44' r='4' fill='#0ea5e9' />
      <circle cx='42' cy='44' r='4' fill='#0ea5e9' />
    </svg>
  ),
}

const services = [
  {
    name: 'Plumbing',
    summary: 'Emergency call-outs, leak detection, and pressurised system care.',
    price: 'From €65',
    meta: 'Average arrival: 90 mins',
    icon: 'plumbing',
  },
  {
    name: 'Cleaning',
    summary: 'Deep cleans, eco detergents, and recurring home refresh programmes.',
    price: 'From €49',
    meta: 'Certified green solutions',
    icon: 'cleaning',
  },
  {
    name: 'Electrical',
    summary: 'Fuse board upgrades, EV charger installs, and safety certification.',
    price: 'From €70',
    meta: 'Safe Electric registered',
    icon: 'electrical',
  },
  {
    name: 'Painting',
    summary: 'Interior refreshes with low-VOC paints and meticulous prep work.',
    price: 'From €55',
    meta: 'Colour consultation included',
    icon: 'painting',
  },
  {
    name: 'Gardening',
    summary: 'Seasonal tidy-ups, lawn care, and pollinator-friendly planting.',
    price: 'From €60',
    meta: 'Sustainable waste removal',
    icon: 'gardening',
  },
  {
    name: 'Moving Help',
    summary: 'Local moves, packing assistance, and furniture assembly support.',
    price: 'From €75',
    meta: 'Two-person crew as standard',
    icon: 'moving',
  },
]

export default function Home(){
  return (
    <div>
      <Hero />
      <main className="container" id="services">
        <h2 className="section-title">Popular Home Services</h2>
        <p className="services-subtitle">Hand-picked Irish professionals delivering greener results on every visit.</p>
        <div className="services-grid" role="list">
          {services.map(service => (
            <article className="service-card" key={service.name} role="listitem">
              <span className="service-card__icon" aria-hidden="true">
                {serviceIcons[service.icon]}
              </span>
              <div className="service-card__body">
                <h3>{service.name}</h3>
                <p>{service.summary}</p>
              </div>
              <footer className="service-card__footer">
                <span className="service-card__price">{service.price}</span>
                <span className="service-card__meta">{service.meta}</span>
              </footer>
            </article>
          ))}
        </div>
      </main>
      <footer className="footer">© {new Date().getFullYear()} FixEasy Ireland</footer>
    </div>
  )
}
