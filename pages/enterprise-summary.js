import Head from 'next/head'

const summarySections = [
  {
    title: 'Infrastructure Overview',
    items: [
      'Frontend: NuxtJS (Vue)',
      'Backend: FastAPI → Express Enterprise API',
      'Domains: fixeasy.irish (Marketplace), fixeasy.irish (GoDaddy + Vercel)',
      'Security: Edge Cloudflare WAF + DDoS Proxy',
      'Database: Supabase / PostgreSQL',
      'Monitoring: Logflare + Posthog (Supabase Add-on)'
    ]
  },
  {
    title: 'Platform Features',
    items: [
      'Service Directory',
      'Booking System',
      'User Accounts',
      'Payment Integration',
      'Reviews & Ratings',
      'Live Chat / WhatsApp Bot',
      'Admin Dashboard'
    ]
  },
  {
    title: 'Enterprise Security Architecture',
    items: [
      'Cloudflare Edge Firewall (WAF)',
      'Digi-Para Staff Gateway (Hardware)',
      'Role-Based Access Control',
      'Biometric & CAPTCHA (Turnstile)',
      'API Rate Limiting (Kong)',
      'Audit Logging'
    ]
  },
  {
    title: 'AI & Smart Automation',
    items: [
      'AI Booking Assistant (GPT, Phone, WhatsApp)',
      'Predictive Maintenance Alerts',
      'Dynamic Pricing Engine',
      'Intelligent Dispatch (Teleport)',
      'Field Technician Tracking (Telemetry)'
    ]
  },
  {
    title: 'Analytics & Monitoring',
    items: [
      'Uptime & Health Monitoring',
      'Error Logging via Sentry / Logflare',
      'API Metrics',
      'Booking Trends Dashboard',
      'Telegram Alerts'
    ]
  },
  {
    title: 'Localization & Growth',
    items: [
      'Multi-language Support (EN, ES, BN)',
      'Regional Pricing',
      'Partner Dashboard',
      'Mobile App (React Native)'
    ]
  }
]

const serviceList = [
  'Home Repair: Plumbing, Electrical, Carpentry, Roof Repairs, Helping Hand, Painting',
  'Cleaning: House, Carpet, Window, Roof, Pressure Washing',
  'Outdoor: Garden Maintenance, Lawn Mowing, Fence Repair',
  'Trades: Carpenter, Welder, Tiling, Locksmith',
  'Tech: Appliance Repair, CCTV, Smart Home Installation',
  'Support Services: Moving Help, Elderly Assistance'
]

const bookingWorkflow = [
  'User selects service and submits booking form',
  'AI validates data, checks availability, and auto-schedules',
  'Customer receives email/SMS confirmation',
  'Technician is assigned with live tracking',
  'Customer monitors job & payments in dashboard'
]

const finalExperience = [
  'Cloudflare Edge — WAF, CDN, DDoS protection',
  'FastAPI → Express Enterprise backend',
  'Supabase — Database',
  'NuxtJS (Vue) — Frontend UI',
  'Stripe — Payments',
  'WhatsApp & Telegram — Real-time updates for services, bookings, and reminders'
]

const operationsTools = [
  'Admin Dashboard (Supabase)',
  'Technician Portal (Supabase Auth)',
  'Analytics Dashboard (Telegram Alerts)',
  'Audit Logging',
  'Staff Onboarding (Enterprise Mail)',
  'CRM Integration (HubSpot)'
]

export default function EnterpriseSummaryPage() {
  return (
    <>
      <Head>
        <title>FixEasy Enterprise Summary</title>
      </Head>
      <div className="enterprise-page">
        <header className="enterprise-header">
          <span className="enterprise-badge">FixEasy Ireland</span>
          <h1>Hybrid Smart Security Architecture</h1>
          <p>Final enterprise overview covering infrastructure, automation, security, and operations.</p>
        </header>

        <section className="enterprise-grid">
          {summarySections.map((section) => (
            <article key={section.title} className="enterprise-card">
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="enterprise-section">
          <article className="enterprise-card enterprise-card--wide">
            <h2>Service List</h2>
            <ul>
              {serviceList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="enterprise-grid">
          <article className="enterprise-card">
            <h2>Booking System (New)</h2>
            <ul>
              <li>Endpoint: /book (POST) — Receive customer bookings</li>
              <li>Endpoint: /services (GET) — List all services</li>
              <li>Endpoint: / — Welcome endpoint</li>
            </ul>
            <div className="enterprise-divider" />
            <h3>Workflow</h3>
            <ol>
              {bookingWorkflow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article className="enterprise-card">
            <h2>Final User Experience</h2>
            <ul>
              {finalExperience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="enterprise-card">
            <h2>Operations &amp; Admin Tools</h2>
            <ul>
              {operationsTools.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </>
  )
}
