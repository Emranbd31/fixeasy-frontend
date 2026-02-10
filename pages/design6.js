import Head from 'next/head';

const heroStats = [
  { label: 'Jobs coordinated', value: '12k+' },
  { label: 'Average response', value: '14 min' },
  { label: 'Cities covered', value: '19' }
];

const serviceCategories = [
  {
    title: 'Electrical & EV installs',
    description:
      'RECI-certified electricians for call-outs, EV charger installs, rewires and preventative maintenance.',
    icon: '/icons/appliances.svg',
    badge: 'Priority slots'
  },
  {
    title: 'Specialist cleaning teams',
    description:
      'Hotel-grade deep cleans, tenancy changeovers and scheduled facilities support with eco-first products.',
    icon: '/icons/moving.svg',
    badge: 'Fixed pricing'
  },
  {
    title: 'Gardening & exterior care',
    description:
      'Estate management, seasonal tidy-ups and landscaping projects with insured horticulture crews.',
    icon: '/icons/gardening.svg',
    badge: 'Crewed vans'
  },
  {
    title: 'Carpentry & bespoke builds',
    description:
      'Responsive insurance repairs, storage design and custom joinery with guaranteed craftsmanship.',
    icon: '/icons/painting.svg',
    badge: 'Joinery pros'
  },
  {
    title: 'Roofing & weatherproofing',
    description:
      'Storm call-outs, leak diagnostics and gutter safeguarding dispatched with rapid access equipment.',
    icon: '/icons/security.svg',
    badge: '24/7 cover'
  },
  {
    title: 'Smart home & IT support',
    description:
      'Connectivity audits, smart device installs and remote troubleshooting for homes and workplaces.',
    icon: '/icons/smart-home.svg',
    badge: 'Remote ready'
  }
];

const valuePillars = [
  {
    title: 'Fully vetted professionals',
    copy:
      'Every FixEasy partner is identity checked, insured in Ireland and monitored through live quality scores.',
    accent: 'from-emerald-200 via-teal-200 to-cyan-200'
  },
  {
    title: 'Control centre visibility',
    copy:
      'Track schedules, crew ETAs, photos and completion reports in real time from any device you already use.',
    accent: 'from-cyan-200 via-sky-200 to-blue-200'
  },
  {
    title: 'Compliance handled for you',
    copy:
      'Method statements, RAMS and service reports are delivered automatically after every visit.',
    accent: 'from-blue-200 via-indigo-200 to-purple-200'
  }
];

const workflowSteps = [
  {
    title: '1. Share your request',
    detail: 'Tell us the property, access info and timeline. We triage urgent incidents immediately.'
  },
  {
    title: '2. Match & schedule crews',
    detail: 'We coordinate availability, compliance documents and communication on your behalf.'
  },
  {
    title: '3. Approve & track delivery',
    detail: 'Receive live updates, approve extras and download completion packs once the job wraps.'
  }
];

const supportChannels = [
  {
    label: 'Emergency line',
    value: '+353 1 697 1520',
    href: 'tel:+35316971520'
  },
  {
    label: 'Booking desk',
    value: 'bookings@fixeasy.irish',
    href: 'mailto:bookings@fixeasy.irish'
  },
  {
    label: 'Client success',
    value: 'support@fixeasy.irish',
    href: 'mailto:support@fixeasy.irish'
  }
];

export default function Design6() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fixeasy.irish';

  return (
    <>
      <Head>
        <title>FixEasy | Verified property services across Ireland</title>
        <meta
          name="description"
          content="Book vetted FixEasy crews for electrical, cleaning, gardening, carpentry, roofing and smart tech support anywhere in Ireland."
        />
        <link rel="canonical" href={`${siteUrl}/design6`} />
        <meta property="og:title" content="FixEasy | Verified property services across Ireland" />
        <meta
          property="og:description"
          content="Trusted FixEasy crews handle urgent call-outs and scheduled projects with live updates from the control centre."
        />
        <meta property="og:url" content={`${siteUrl}/design6`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50 text-slate-900">
        <header className="border-b border-teal-100/80 bg-white/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
            <span className="text-2xl font-semibold tracking-tight text-teal-900">FixEasy</span>
            <nav className="hidden items-center gap-8 text-sm font-medium text-teal-800 md:flex">
              <a className="transition hover:text-teal-600" href="#services">
                Services
              </a>
              <a className="transition hover:text-teal-600" href="#why">
                Why FixEasy
              </a>
              <a className="transition hover:text-teal-600" href="#workflow">
                How it works
              </a>
              <a className="transition hover:text-teal-600" href="#support">
                Support
              </a>
              <a
                className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-500"
                href="mailto:bookings@fixeasy.irish"
              >
                Book crews
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
          <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">
                Ireland&apos;s property pros
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-teal-950 md:text-5xl">
                Same-day crews with reports you can rely on
              </h1>
              <p className="text-base text-slate-700 md:text-lg">
                Facilities teams, landlords and busy households count on FixEasy for urgent call-outs and planned works. We manage
                coordination, compliance and communication so you stay ahead of every request.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 hover:bg-teal-500"
                  href="mailto:bookings@fixeasy.irish"
                >
                  Start a request
                  <span aria-hidden className="text-lg">→</span>
                </a>
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-white px-5 py-3 text-sm text-teal-700">
                  <span className="text-xl">★</span>
                  4.9 rating across 1,200+ jobs
                </span>
              </div>
              <dl className="grid gap-6 text-sm text-slate-600 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-teal-100 bg-white/80 p-5 shadow-sm">
                    <dt className="text-xs uppercase tracking-[0.25em] text-teal-500">{stat.label}</dt>
                    <dd className="mt-3 text-2xl font-semibold text-teal-900">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-teal-200/40 blur-3xl" aria-hidden />
              <div className="absolute -bottom-8 -right-10 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[32px] border border-teal-100 bg-white/90 p-6 shadow-2xl shadow-teal-900/5">
                <div className="flex items-center justify-between text-sm text-teal-800">
                  <p className="font-semibold text-teal-900">Live control centre</p>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Online</span>
                </div>
                <ul className="mt-6 space-y-4 text-sm text-slate-600">
                  <li className="flex items-center justify-between rounded-2xl border border-teal-100 bg-teal-50/60 px-4 py-3">
                    <div>
                      <p className="font-semibold text-teal-900">EV charger install</p>
                      <p>Blackrock · Dublin</p>
                    </div>
                    <span className="text-teal-600">ETA 14:20</span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl border border-teal-100 bg-white px-4 py-3 shadow-sm">
                    <div>
                      <p className="font-semibold text-teal-900">Tenancy deep clean</p>
                      <p>Douglas · Cork</p>
                    </div>
                    <span className="text-teal-600">Crew en route</span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl border border-teal-100 bg-teal-50/60 px-4 py-3">
                    <div>
                      <p className="font-semibold text-teal-900">Storm gutter response</p>
                      <p>Galway City</p>
                    </div>
                    <span className="text-teal-600">Scaffolding ready</span>
                  </li>
                </ul>
                <div className="mt-6 rounded-2xl border border-dashed border-teal-200 bg-white px-4 py-3 text-xs text-slate-500">
                  New requests open from 07:00 with 24/7 emergency escalation.
                </div>
              </div>
            </div>
          </section>

          <section id="services" className="space-y-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Services</p>
                <h2 className="mt-2 text-3xl font-semibold text-teal-950 md:text-4xl">Specialist crews we dispatch daily</h2>
              </div>
              <p className="max-w-2xl text-base text-slate-600">
                FixEasy coordinates fully equipped teams across residential, commercial and hospitality properties. Explore a
                snapshot of the most requested categories we cover.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {serviceCategories.map((service) => (
                <article
                  key={service.title}
                  className="group relative overflow-hidden rounded-3xl border border-teal-100 bg-white p-8 shadow-lg shadow-teal-900/5 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50">
                      <img src={service.icon} alt="" className="h-6 w-6" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-500">FixEasy crew</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-teal-950">{service.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">{service.description}</p>
                  <span className="mt-5 inline-flex w-max items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-teal-600">
                    {service.badge}
                  </span>
                  <span className="absolute bottom-8 right-8 text-2xl text-teal-200 transition group-hover:translate-x-1 group-hover:text-teal-400">
                    →
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section id="why" className="rounded-[40px] border border-teal-100 bg-white/90 p-10 shadow-xl shadow-teal-900/5">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Why FixEasy</p>
                <h2 className="mt-3 text-3xl font-semibold text-teal-950 md:text-4xl">More than a marketplace</h2>
                <p className="mt-4 text-base text-slate-600">
                  Our Dublin dispatch team takes responsibility for each booking from quote to completion. Clients stay informed
                  without chasing multiple suppliers.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {valuePillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="group relative overflow-hidden rounded-3xl border border-teal-100 bg-teal-50/60 p-6"
                  >
                    <div className={`absolute inset-x-6 top-0 h-32 rounded-full bg-gradient-to-r ${pillar.accent} opacity-50 blur-2xl`} aria-hidden />
                    <div className="relative">
                      <h3 className="text-lg font-semibold text-teal-900">{pillar.title}</h3>
                      <p className="mt-3 text-sm text-slate-600">{pillar.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="workflow" className="space-y-10">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold text-teal-950 md:text-4xl">A proven workflow for every property</h2>
              <p className="mt-4 text-base text-slate-600">
                Whether you&apos;re coordinating a single visit or rolling programme, FixEasy keeps every stakeholder aligned.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {workflowSteps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-3xl border border-teal-100 bg-white/90 p-6 text-left shadow-lg shadow-teal-900/5"
                >
                  <h3 className="text-lg font-semibold text-teal-900">{step.title}</h3>
                  <p className="mt-3 text-sm text-slate-600">{step.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="support" className="rounded-[40px] border border-teal-100 bg-white/90 p-10 shadow-xl shadow-teal-900/5">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Support & assurance</p>
                <h2 className="mt-3 text-3xl font-semibold text-teal-950 md:text-4xl">Your guarantee from the FixEasy team</h2>
                <ul className="mt-6 space-y-4 text-base text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-600">
                      ✓
                    </span>
                    <span>All crews are Garda vetted, insured and tracked for continuous performance.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-600">
                      ✓
                    </span>
                    <span>Digital reports, before & after photos and compliance documents delivered automatically.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-600">
                      ✓
                    </span>
                    <span>Emergency escalation with human support 24/7, nationwide.</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl border border-dashed border-teal-200 bg-teal-50/60 p-6">
                <h3 className="text-lg font-semibold text-teal-900">Contact the control centre</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Need to fast-track a request or arrange a maintenance plan? Reach the team directly through any of the channels
                  below.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4">
                  {supportChannels.map((channel) => (
                    <a
                      key={channel.label}
                      href={channel.href}
                      className="rounded-2xl border border-teal-100 bg-white px-5 py-4 text-sm text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-900"
                    >
                      <span className="block text-xs uppercase tracking-[0.25em] text-teal-500">{channel.label}</span>
                      <span className="mt-2 block text-lg font-semibold">{channel.value}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-teal-100 bg-gradient-to-br from-teal-600 via-teal-500 to-sky-500 p-10 text-white shadow-2xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <h2 className="text-3xl font-semibold md:text-4xl">Ready to streamline your property operations?</h2>
                <p className="mt-4 text-base text-teal-100">
                  Share your next project or maintenance programme and the FixEasy team will respond with a tailored plan within
                  minutes.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-4 md:justify-center">
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-teal-700 shadow-xl shadow-teal-900/30 transition hover:-translate-y-0.5 hover:text-teal-800"
                  href="mailto:bookings@fixeasy.irish"
                >
                  Book a crew
                  <span aria-hidden className="text-lg">→</span>
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
                  href="tel:+35316971520"
                >
                  Talk to dispatch
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-teal-100 bg-white/90 py-10">
          <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} FixEasy Ireland. Vetted professionals, transparent reporting and nationwide support.
          </div>
        </footer>
      </div>
    </>
  );
}
