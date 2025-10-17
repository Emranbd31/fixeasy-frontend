import Head from 'next/head'
import { motion } from 'framer-motion'
import { BadgeCheck, UploadCloud } from 'lucide-react'

import { NavBar } from '../../../components/NavBar'
import { Footer } from '../../../components/Footer'
import { DashboardCard } from '../../../components/DashboardCard'
import { MetricsCard } from '../../../components/MetricsCard'
import { useUser } from '../../../contexts/UserContext'

const assignedJobs = [
  {
    id: 'JOB-5521',
    title: 'EV charger install',
    location: 'Dublin 4',
    schedule: 'Tomorrow · 08:00',
    payout: '€420',
  },
  {
    id: 'JOB-5516',
    title: 'Emergency call-out',
    location: 'Dublin 2',
    schedule: 'Today · 19:30',
    payout: '€185',
  },
]

const earningsSummary = [
  { label: 'This week', value: '€1,860', accent: 'brand' as const },
  { label: 'Awaiting payout', value: '€540', accent: 'amber' as const },
  { label: 'Avg. rating', value: '4.9', accent: 'emerald' as const },
]

export default function ProfessionalDashboardPage() {
  const { user } = useUser()
  const proName = user?.user_metadata?.full_name || user?.email || 'Professional'
  const status = (user?.user_metadata?.status as string) || 'pending'

  const isPending = status === 'pending' || status === 'pending_approval'

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Head>
        <title>Professional Dashboard | FixEasy</title>
      </Head>
      <NavBar />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-brand to-accent-cyan py-16 text-white">
          <div className="container">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.3em] text-white/60">
              Dashboard · Professional
            </nav>
            <p className="text-sm uppercase tracking-widest text-white/80">Professional hub</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">Welcome back, {proName}</h1>
            <p className="mt-3 max-w-2xl text-base text-white/80">
              Track assigned jobs, earnings, and compliance status from one place.
            </p>
          </div>
        </section>

        <section className="section-spacing">
          <div className="container space-y-10">
            {isPending ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card-surface border border-amber-300/60 bg-amber-100/60 p-5 text-amber-900 shadow-brand-soft dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <BadgeCheck className="h-5 w-5" />
                  <p className="text-sm font-semibold">Your account is pending verification. Upload optional ID to speed things up.</p>
                </div>
              </motion.div>
            ) : null}

            <div className="grid gap-8 lg:grid-cols-3">
              <DashboardCard title="Profile" description="Your public details">
                <p className="font-semibold text-slate-900 dark:text-white">{proName}</p>
                <p>{user?.email}</p>
                <p>Coverage area: Dublin, Kildare</p>
                <p>Categories: Electrical & EV, Emergency call-outs</p>
              </DashboardCard>

              <DashboardCard title="Assigned jobs" description="Today and upcoming">
                {assignedJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    whileHover={{ scale: 1.01 }}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-slate-600 shadow-brand-soft transition-all duration-300 hover:border-brand hover:text-brand dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">{job.id}</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{job.title}</p>
                    <p>{job.location}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{job.schedule}</p>
                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">Payout {job.payout}</p>
                  </motion.div>
                ))}
                <a href="/book" className="mt-3 inline-flex text-sm font-semibold text-brand">
                  View all jobs →
                </a>
              </DashboardCard>

              <DashboardCard title="Earnings" description="Live performance insights">
                <div className="grid gap-4">
                  {earningsSummary.map((metric) => (
                    <MetricsCard key={metric.label} label={metric.label} value={metric.value} accent={metric.accent} />
                  ))}
                </div>
              </DashboardCard>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <DashboardCard title="New job requests" description="Opportunities waiting for your response.">
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-slate-600 shadow-brand-soft transition-all duration-300 hover:border-brand hover:text-brand dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">JOB-5524</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">Commercial lighting upgrade</p>
                    <p>Grand Canal Dock · 2-day project · €1,650</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="badge bg-white/80 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">Requires Safe Electric</span>
                      <span className="badge bg-white/80 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">Start 26 Aug</span>
                    </div>
                  </motion.div>
                </div>
              </DashboardCard>

              <DashboardCard title="Optional ID upload" description="Help us verify you faster">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Upload a photo ID so our compliance team can verify you sooner. This step is optional but recommended.
                </p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-white/80 px-5 py-2 text-sm font-semibold text-brand transition-all duration-300 hover:-translate-y-0.5 hover:bg-white dark:border-accent-cyan/40 dark:bg-slate-900/70 dark:text-accent-cyan">
                  <UploadCloud className="h-4 w-4" /> Upload ID
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400">PDF, JPG, or PNG. &lt; 10 MB.</p>
              </DashboardCard>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
