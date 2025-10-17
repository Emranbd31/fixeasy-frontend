import Head from 'next/head'
import { motion } from 'framer-motion'

import { NavBar } from '../../../components/NavBar'
import { Footer } from '../../../components/Footer'
import { DashboardCard } from '../../../components/DashboardCard'
import { useUser } from '../../../contexts/UserContext'

const bookings = [
  {
    id: 'BK-2488',
    service: 'Boiler service',
    date: '12 Aug 2024',
    time: '09:30',
    pro: 'Emerald Heating',
    status: 'confirmed',
  },
  {
    id: 'BK-2482',
    service: 'Interior repaint',
    date: '22 Aug 2024',
    time: '08:00',
    pro: 'Colourline Decorators',
    status: 'pending',
  },
  {
    id: 'BK-2471',
    service: 'Garden tidy',
    date: '14 Jul 2024',
    time: '13:00',
    pro: 'Wildflower Gardens',
    status: 'completed',
  },
]

const recommendedServices = [
  {
    title: 'Annual electrical health check',
    description: 'Preventive inspection with thermal imaging and compliance report.',
  },
  {
    title: 'Gutter guard installation',
    description: 'Protect your property from blockages with maintenance-free guards.',
  },
  {
    title: 'Deep clean before guests arrive',
    description: 'One-off hotel-standard cleaning with eco products and linen service.',
  },
]

function statusClass(status: string) {
  switch (status) {
    case 'pending':
      return 'status-pending'
    case 'confirmed':
      return 'status-confirmed'
    case 'completed':
      return 'status-completed'
    default:
      return 'status-pending'
  }
}

export default function ClientDashboardPage() {
  const { user } = useUser()
  const name = user?.user_metadata?.full_name || user?.email || 'Client'

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Head>
        <title>Client Dashboard | FixEasy</title>
      </Head>
      <NavBar />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-brand to-accent-cyan py-16 text-white">
          <div className="container">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.3em] text-white/60">
              Dashboard · Client
            </nav>
            <p className="text-sm uppercase tracking-widest text-white/80">Welcome</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">Welcome, {name} 👋</h1>
            <p className="mt-3 max-w-2xl text-base text-white/80">
              Manage bookings, discover new services, and keep your property maintenance on schedule with FixEasy.
            </p>
          </div>
        </section>

        <section className="section-spacing">
          <div className="container grid gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-4">
              <DashboardCard title="Your profile" description="Keep your details up to date for smoother bookings.">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-slate-900 dark:text-white">{name}</p>
                  <p>{user?.email}</p>
                  <p>Eircode saved in profile: D02 F206</p>
                </div>
                <button className="mt-4 inline-flex items-center rounded-full bg-gradient-to-r from-brand to-accent-cyan px-5 py-2 text-sm font-semibold text-white shadow-brand-card transition-transform duration-300 hover:-translate-y-0.5">
                  Update details
                </button>
              </DashboardCard>

              <DashboardCard title="Need something else?" description="Our concierge team can assist with bespoke jobs.">
                <p>Chat with us on <a href="mailto:concierge@fixeasy.irish" className="text-brand">concierge@fixeasy.irish</a>.</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Available Mon–Sun, 07:00–21:00.</p>
              </DashboardCard>
            </div>

            <div className="space-y-8 lg:col-span-8">
              <DashboardCard title="Upcoming & recent bookings" description="Track live status for every job.">
                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-12 text-center dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">No bookings yet</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Start by requesting your first service.</p>
                    <a
                      href="/book"
                      className="mt-4 inline-flex items-center rounded-full bg-gradient-to-r from-brand to-accent-cyan px-5 py-2 text-sm font-semibold text-white shadow-brand-card"
                    >
                      Book a service
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-brand-card dark:border-slate-800 dark:bg-slate-900/70 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">{booking.id}</p>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{booking.service}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {booking.date} · {booking.time} with {booking.pro}
                          </p>
                        </div>
                        <span className={statusClass(booking.status)}> {booking.status}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </DashboardCard>

              <DashboardCard title="Recommended services">
                <div className="grid gap-4 md:grid-cols-2">
                  {recommendedServices.map((service) => (
                    <motion.div
                      key={service.title}
                      whileHover={{ scale: 1.02 }}
                      className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-slate-600 shadow-brand-soft transition-all duration-300 hover:border-brand hover:text-brand dark:border-slate-800 dark:bg-slate-900/70"
                    >
                      <p className="font-semibold text-slate-900 dark:text-white">{service.title}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">{service.description}</p>
                      <a href="/book" className="mt-3 inline-flex text-sm font-semibold text-brand">
                        Book now →
                      </a>
                    </motion.div>
                  ))}
                </div>
              </DashboardCard>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
