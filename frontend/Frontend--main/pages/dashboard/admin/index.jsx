import { useEffect, useState } from 'react'
import Head from 'next/head'
import { ShieldCheck, Users, ClipboardList, Activity } from 'lucide-react'

import { NavBar } from '../../../components/NavBar'
import { Footer } from '../../../components/Footer'
import { MetricsCard } from '../../../components/MetricsCard'
import { DashboardCard } from '../../../components/DashboardCard'

const professionalRows = [
  { name: 'Emma Byrne', company: 'BrightSpark Electrics', status: 'verified', jobs: 182 },
  { name: 'Daniel Murphy', company: 'Skyline Roofing', status: 'pending', jobs: 34 },
  { name: 'Aoife Nolan', company: 'Nolan Decor', status: 'verified', jobs: 98 },
]

const bookingRows = [
  { id: 'BK-2488', client: 'Sarah Donnelly', service: 'Boiler service', status: 'Confirmed' },
  { id: 'BK-2482', client: 'Thompson & Co', service: 'Office deep clean', status: 'Pending' },
  { id: 'BK-2471', client: 'Kevin Daly', service: 'Garden tidy', status: 'Completed' },
]

const auditLogs = [
  { id: 'AUD-8841', actor: 'admin@fixeasy.irish', event: 'Approved professional #992', timestamp: '12 Aug · 09:31' },
  { id: 'AUD-8835', actor: 'qa@fixeasy.irish', event: 'Updated risk matrix for plumbing', timestamp: '11 Aug · 17:22' },
  { id: 'AUD-8832', actor: 'ops@fixeasy.irish', event: 'Exported bookings CSV', timestamp: '11 Aug · 15:04' },
]

const metrics = [
  { label: 'Total users', value: '12,482', accent: 'brand', icon: <Users className="h-6 w-6" /> },
  { label: 'Verified pros', value: '518', accent: 'emerald', icon: <ShieldCheck className="h-6 w-6" /> },
  { label: 'Pending pros', value: '42', accent: 'amber', icon: <ClipboardList className="h-6 w-6" /> },
  { label: 'Active bookings', value: '327', accent: 'brand', icon: <Activity className="h-6 w-6" /> },
]

function statusBadgeClass(status) {
  switch (status) {
    case 'verified':
      return 'status-confirmed'
    case 'pending':
      return 'status-pending'
    case 'rejected':
      return 'status-rejected'
    default:
      return 'status-pending'
  }
}

export default function AdminDashboardPage() {
  const [health, setHealth] = useState({ status: 'unknown', message: 'Checking…' })

  useEffect(() => {
    let isMounted = true
    fetch('https://api.fixeasy.irish/health')
      .then(async (response) => {
        if (!isMounted) return
        if (response.ok) {
          const data = await response.json().catch(() => ({}))
          setHealth({ status: 'healthy', message: data?.status || 'Operational' })
        } else {
          setHealth({ status: 'warning', message: 'Response received but indicates a warning.' })
        }
      })
      .catch(() => {
        if (!isMounted) return
        setHealth({ status: 'error', message: 'Unable to reach API.' })
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Head>
        <title>Admin Dashboard | FixEasy</title>
      </Head>
      <NavBar />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-brand to-accent-cyan py-16 text-white">
          <div className="container">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.3em] text-white/60">
              Dashboard · Admin
            </nav>
            <p className="text-sm uppercase tracking-widest text-white/80">Admin control centre</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">Operational overview</h1>
            <p className="mt-3 max-w-2xl text-base text-white/80">
              Monitor platform health, approve professionals, and audit every change from a single view.
            </p>
          </div>
        </section>

        <section className="section-spacing">
          <div className="container space-y-10">
            <div className="grid gap-6 lg:grid-cols-4">
              {metrics.map((metric) => (
                <MetricsCard key={metric.label} label={metric.label} value={metric.value} icon={metric.icon} accent={metric.accent} />
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <DashboardCard title="Pending professionals" description="Review and approve new partners.">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Company</th>
                        <th scope="col">Status</th>
                        <th scope="col">Jobs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {professionalRows.map((row) => (
                        <tr key={row.name}>
                          <td className="font-semibold text-slate-900 dark:text-white">{row.name}</td>
                          <td>{row.company}</td>
                          <td>
                            <span className={statusBadgeClass(row.status)}>{row.status}</span>
                          </td>
                          <td>{row.jobs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DashboardCard>

              <DashboardCard title="Active bookings" description="Live dispatch overview">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Booking</th>
                        <th scope="col">Client</th>
                        <th scope="col">Service</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingRows.map((row) => (
                        <tr key={row.id}>
                          <td className="font-semibold text-slate-900 dark:text-white">{row.id}</td>
                          <td>{row.client}</td>
                          <td>{row.service}</td>
                          <td>
                            <span className={statusBadgeClass(row.status.toLowerCase())}>{row.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DashboardCard>

              <DashboardCard title="Audit log" description="Every change is recorded.">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Event</th>
                        <th scope="col">Actor</th>
                        <th scope="col">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="font-semibold text-slate-900 dark:text-white">{log.event}</td>
                          <td>{log.actor}</td>
                          <td>{log.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DashboardCard>
            </div>

            <DashboardCard title="System health" description="Uptime and monitoring insights.">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`status-chip ${
                    health.status === 'healthy'
                      ? 'status-confirmed'
                      : health.status === 'warning'
                      ? 'status-pending'
                      : health.status === 'error'
                      ? 'status-rejected'
                      : 'status-pending'
                  }`}
                >
                  {health.status}
                </span>
                <p>{health.message}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last checked: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </DashboardCard>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
