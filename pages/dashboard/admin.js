import { useCallback, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { decodeSession, SESSION_COOKIE } from '../../lib/admin-session'

const summaryCards = [
  {
    label: 'Active bookings',
    value: '128',
    trend: '+12%',
    trendLabel: 'vs last week',
    accent: 'primary'
  },
  {
    label: 'Resolution SLA',
    value: '97.6%',
    trend: '+2.1%',
    trendLabel: 'breaches down',
    accent: 'success'
  },
  {
    label: 'Payouts scheduled',
    value: '€42.8k',
    trend: '18 pending',
    trendLabel: 'Stripe Connect',
    accent: 'surface'
  },
  {
    label: 'Open escalations',
    value: '3',
    trend: '1 new',
    trendLabel: 'needs review',
    accent: 'warning'
  }
]

const recentBookings = [
  {
    id: '#BK-2481',
    client: 'Sarah O’Connell',
    service: 'Emergency plumbing',
    scheduled: 'Today · 14:30',
    status: 'En route'
  },
  {
    id: '#BK-2479',
    client: 'Thompson & Co',
    service: 'Office deep clean',
    scheduled: 'Tomorrow · 07:45',
    status: 'Confirmed'
  },
  {
    id: '#BK-2472',
    client: 'Kevin Daly',
    service: 'EV charger install',
    scheduled: 'Thu · 09:00',
    status: 'Awaiting docs'
  }
]

const escalations = [
  {
    id: '#ESC-58',
    title: 'Water damage follow-up',
    owner: 'Niamh Walsh',
    updated: '12 min ago',
    severity: 'High'
  },
  {
    id: '#ESC-59',
    title: 'Reschedule SLA breach',
    owner: 'Patrick Byrne',
    updated: '24 min ago',
    severity: 'Medium'
  }
]

const securityEvents = [
  {
    id: '#SE-4412',
    description: 'New device approval · pro.jimenez@fixeasy',
    timestamp: '10:21',
    badge: 'info'
  },
  {
    id: '#SE-4411',
    description: 'Turnstile challenge solved · contact form',
    timestamp: '09:55',
    badge: 'success'
  },
  {
    id: '#SE-4406',
    description: 'MFA enforcement reminder · 6 providers',
    timestamp: '08:17',
    badge: 'warning'
  }
]

const quickActions = [
  'Create manual booking',
  'Issue partial refund',
  'Trigger KYC refresh',
  'Send client update',
  'Add feature flag override'
]

export default function AdminDashboard({ initialSession }) {
  const router = useRouter()
  const [session, setSession] = useState(initialSession)
  const [error, setError] = useState('')
  const [reviewItems, setReviewItems] = useState([])
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [modalItem, setModalItem] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const nextAction = useMemo(() => quickActions[0], [])
  const adminName = useMemo(() => session?.email?.split('@')?.[0] ?? 'Admin', [session?.email])

  useEffect(() => {
    if (!session) {
      router.replace('/auth/admin')
    }
  }, [router, session])

  const normaliseDocuments = useCallback((entry) => {
    if (Array.isArray(entry?.documents) && entry.documents.length > 0) {
      return entry.documents.map((document) => ({
        key: document.key ?? document.type ?? document.label ?? document.name,
        label: document.label ?? document.type ?? 'Document',
        url: document.downloadUrl ?? document.url ?? document.publicUrl,
        previewUrl: document.previewUrl ?? document.thumbnailUrl ?? null,
        updatedAt: document.updatedAt ?? entry.submittedAt
      }))
    }

    const verificationDocs = entry?.verificationDocuments ?? {}
    return [
      verificationDocs.passport_url
        ? {
            key: 'passport',
            label: 'Passport or National ID',
            url: verificationDocs.passport_url,
            previewUrl: verificationDocs.passport_preview ?? null
          }
        : null,
      verificationDocs.licence_url
        ? {
            key: 'licence',
            label: 'Driving Licence',
            url: verificationDocs.licence_url,
            previewUrl: verificationDocs.licence_preview ?? null
          }
        : null,
      verificationDocs.address_url
        ? {
            key: 'address',
            label: 'Address Proof',
            url: verificationDocs.address_url,
            previewUrl: verificationDocs.address_preview ?? null
          }
        : null
    ].filter(Boolean)
  }, [])

  const loadReviewItems = useCallback(async () => {
    if (!session) return

    setReviewLoading(true)
    setReviewError('')

    try {
      const response = await fetch('/api/admin/professionals?status=pending_verification')
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.error ?? 'Unable to load pending verifications')
      }

      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : []

      setReviewItems(
        items.map((entry) => ({
          id: entry.id ?? entry.uuid ?? entry.reference,
          name: entry.fullName ?? entry.businessName ?? entry.contactName ?? 'Professional',
          submittedAt: entry.submittedAt ?? entry.createdAt ?? entry.created_at ?? new Date().toISOString(),
          status: entry.status ?? 'pending_verification',
          documents: normaliseDocuments(entry)
        }))
      )
    } catch (fetchError) {
      setReviewError(fetchError.message || 'Could not load professional documents.')
      setReviewItems([])
    } finally {
      setReviewLoading(false)
    }
  }, [session, normaliseDocuments])

  useEffect(() => {
    loadReviewItems()
  }, [loadReviewItems])

  useEffect(() => {
    if (!session) {
      return
    }

    loadReviewItems()
  }, [session, loadReviewItems])

  const handleViewDocuments = (item) => {
    setModalItem(item)
    setReviewError('')
  }

  const handleCloseModal = () => {
    setModalItem(null)
  }

  const handleApprove = async (item) => {
    setActionLoading(true)
    setReviewError('')
    try {
      const response = await fetch(`/api/admin/approve-pro/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result?.error ?? 'Unable to approve professional')
      }
      await loadReviewItems()
    } catch (approveError) {
      setReviewError(approveError.message || 'Approval failed. Try again shortly.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (item) => {
    const reason = typeof window !== 'undefined' ? window.prompt('Enter rejection reason (included in email):') : ''
    if (!reason) {
      return
    }

    setActionLoading(true)
    setReviewError('')
    try {
      const response = await fetch(`/api/admin/reject-pro/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result?.error ?? 'Unable to reject professional')
      }
      await loadReviewItems()
    } catch (rejectError) {
      setReviewError(rejectError.message || 'Rejection failed. Try again shortly.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/admin/logout', { method: 'POST' })
      if (!response.ok) {
        throw new Error('Unable to log out. Please try again.')
      }
      setSession(null)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('fixeasy_role')
      }
      router.push('/auth/admin')
    } catch (logoutError) {
      setError(logoutError.message)
    }
  }

  return (
    <div className="admin-page">
      <Head>
        <title>FixEasy Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {!session ? (
        <div className="admin-login">
          <div className="admin-login__card" role="alert" aria-live="assertive">
            <h1>Session expired</h1>
            <p>Your admin session has ended. Redirecting to secure login…</p>
          </div>
        </div>
      ) : (
        <main className="admin-dashboard">
          <header className="admin-dashboard__header">
            <div>
              <p className="admin-dashboard__eyebrow">Dashboard</p>
              <h1>Welcome back, {adminName}</h1>
              <p className="admin-dashboard__subtitle">
                Here’s an overview of today’s operations, escalations, and security posture across FixEasy.
              </p>
            </div>
            <div className="admin-dashboard__cta-group">
              <button type="button" className="admin-dashboard__primary">
                Create update
              </button>
              <button type="button" className="admin-dashboard__secondary" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </header>

          {error ? (
            <div className="admin-alert admin-alert--error" role="alert">
              {error}
            </div>
          ) : null}

          <section className="admin-review" aria-labelledby="admin-review-heading">
            <div className="admin-panel admin-panel--wide admin-review__panel">
              <header className="admin-panel__header">
                <div>
                  <p className="admin-panel__eyebrow">Verification queue</p>
                  <h2 id="admin-review-heading">Professional document reviews</h2>
                </div>
                <div className="admin-review__actions">
                  <button type="button" onClick={loadReviewItems} disabled={reviewLoading}>
                    Refresh
                  </button>
                </div>
              </header>

              {reviewError ? (
                <div className="admin-alert admin-alert--error" role="alert">
                  {reviewError}
                </div>
              ) : null}

              {reviewLoading ? (
                <p className="admin-review__empty" role="status">
                  Loading pending verifications…
                </p>
              ) : reviewItems.length === 0 ? (
                <p className="admin-review__empty" role="status">
                  All professional submissions are up to date.
                </p>
              ) : (
                <table className="admin-table admin-review__table">
                  <thead>
                    <tr>
                      <th scope="col">Professional</th>
                      <th scope="col">Docs uploaded</th>
                      <th scope="col">Submitted</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="admin-review__actions-column">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.documents.length}</td>
                        <td>
                          <time dateTime={item.submittedAt}>
                            {new Date(item.submittedAt).toLocaleString('en-IE', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </time>
                        </td>
                        <td>
                          <span className="admin-status-chip">{item.status.replace('_', ' ')}</span>
                        </td>
                        <td>
                          <div className="admin-review__table-actions">
                            <button type="button" onClick={() => handleViewDocuments(item)}>
                              View documents
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprove(item)}
                              disabled={actionLoading}
                              className="admin-review__approve"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(item)}
                              disabled={actionLoading}
                              className="admin-review__reject"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section className="admin-dashboard__grid">
            {summaryCards.map((card) => (
              <article key={card.label} className={`admin-card admin-card--${card.accent}`}>
                <p className="admin-card__label">{card.label}</p>
                <p className="admin-card__value">{card.value}</p>
                <p className="admin-card__trend">
                  <span>{card.trend}</span> {card.trendLabel}
                </p>
              </article>
            ))}
          </section>

          <section className="admin-panels">
            <div className="admin-panel admin-panel--wide">
              <header className="admin-panel__header">
                <h2>Live bookings</h2>
                <button type="button">View all</button>
              </header>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Booking</th>
                    <th scope="col">Client</th>
                    <th scope="col">Service</th>
                    <th scope="col">Schedule</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.client}</td>
                      <td>{booking.service}</td>
                      <td>{booking.scheduled}</td>
                      <td>
                        <span className="admin-status-chip">{booking.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="admin-panel admin-panel--stacked">
              <div className="admin-panel__block">
                <header className="admin-panel__header">
                  <h2>Escalations</h2>
                  <button type="button">Assign</button>
                </header>
                <ul className="admin-list">
                  {escalations.map((item) => (
                    <li key={item.id}>
                      <div>
                        <p className="admin-list__title">{item.title}</p>
                        <p className="admin-list__meta">
                          {item.owner} · {item.updated}
                        </p>
                      </div>
                      <span className={`admin-chip admin-chip--${item.severity.toLowerCase()}`}>{item.severity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="admin-panel__block">
                <header className="admin-panel__header">
                  <h2>Security events</h2>
                  <button type="button">Audit log</button>
                </header>
                <ul className="admin-list admin-list--dense">
                  {securityEvents.map((event) => (
                    <li key={event.id}>
                      <div>
                        <p className="admin-list__title">{event.description}</p>
                        <p className="admin-list__meta">{event.timestamp}</p>
                      </div>
                      <span className={`admin-chip admin-chip--${event.badge}`}>New</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="admin-panel__block admin-panel__block--actions">
                <h2>Quick actions</h2>
                <ul className="admin-actions">
                  {quickActions.map((action) => (
                    <li key={action}>
                      <button type="button">{action}</button>
                    </li>
                  ))}
                </ul>
                <p className="admin-panel__hint">Suggested next step: {nextAction}</p>
              </div>
            </aside>
          </section>
        </main>
      )}

      {modalItem ? (
        <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
          <div className="admin-modal__content">
            <header className="admin-modal__header">
              <div>
                <p className="admin-modal__eyebrow">Documents</p>
                <h2 id="admin-modal-title">{modalItem.name}</h2>
              </div>
              <button type="button" className="admin-modal__close" onClick={handleCloseModal}>
                Close
              </button>
            </header>

            <ul className="admin-modal__documents">
              {modalItem.documents.map((document) => (
                <li key={document.key}>
                  <div className="admin-modal__thumbnail" aria-hidden={document.previewUrl ? 'false' : 'true'}>
                    {document.previewUrl ? (
                      <img src={document.previewUrl} alt={`${document.label} preview`} />
                    ) : (
                      <span>{document.label.charAt(0)}</span>
                    )}
                  </div>
                  <div className="admin-modal__meta">
                    <p>{document.label}</p>
                    <a href={document.url} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="admin-modal__footer">
              <button type="button" className="admin-review__approve" onClick={() => handleApprove(modalItem)}>
                Approve
              </button>
              <button type="button" className="admin-review__reject" onClick={() => handleReject(modalItem)}>
                Reject
              </button>
              <button type="button" className="admin-secondary" onClick={handleCloseModal}>
                Close
              </button>
            </footer>
          </div>
        </div>
      ) : null}

    </div>
  )
}

export async function getServerSideProps({ req, resolvedUrl }) {
  const cookie = req.cookies?.[SESSION_COOKIE] ?? ''
  const session = await decodeSession(cookie)

  if (!session) {
    return {
      redirect: {
        destination: `/auth/admin?redirect=${encodeURIComponent(resolvedUrl)}`,
        permanent: false
      }
    }
  }

  return {
    props: {
      initialSession: session
    }
  }
}
