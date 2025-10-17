import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useUser } from '../contexts/UserContext'
import { getSupabaseServerClient } from '../lib/supabaseServer'
import { getCsrfToken } from '../lib/csrfClient'
import { ensureCsrfCookie } from '../lib/csrf'

const services = [
  {
    slug: 'plumbing',
    name: 'Plumbing',
    description: 'Emergency fixes, leak repair, and new installations.',
  },
  {
    slug: 'electrical',
    name: 'Electrical',
    description: 'Certified electricians for diagnostics and rewiring.',
  },
  {
    slug: 'cleaning',
    name: 'Cleaning',
    description: 'Residential and commercial deep cleans.',
  },
  {
    slug: 'gardening',
    name: 'Gardening',
    description: 'Garden tidy-ups, hedge trimming, and maintenance.',
  },
  {
    slug: 'painting',
    name: 'Painting & Decorating',
    description: 'Interior and exterior painting projects.',
  },
]

export default function Book() {
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [form, setForm] = useState({
    service_slug: '',
    scheduled_for: '',
    duration_minutes: 60,
    notes: '',
  })

  const selectedService = services.find((service) => service.slug === form.service_slug)

  const handleNext = () => {
    if (step === 0 && !form.service_slug) {
      setError('Please choose a service to continue')
      return
    }
    setError(null)
    setStep((prev) => prev + 1)
  }

  const handlePrevious = () => {
    setError(null)
    setStep((prev) => Math.max(0, prev - 1))
  }

  const handleConfirm = async () => {
    if (!form.scheduled_for) {
      setError('Select your preferred appointment time')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        service_slug: form.service_slug,
        scheduled_for: new Date(form.scheduled_for).toISOString(),
        duration_minutes: form.duration_minutes,
        notes: form.notes,
        metadata: {
          submitted_from: 'booking-wizard',
        },
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken(),
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to create booking')
      }

      setConfirmation({
        bookingId: data.booking_id,
        status: data.status,
        scheduledFor: form.scheduled_for,
      })
      setStep(3)
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Book a FixEasy Professional</title>
      </Head>
      <section className="booking">
        <div className="booking__card">
          <header className="booking__header">
            <h1>Secure your booking</h1>
            <p>Authenticated as {user?.email}</p>
            <p className="booking__step">Step {Math.min(step + 1, 3)} of 3</p>
          </header>

          {error && <p className="booking__error">{error}</p>}

          {step === 0 && (
            <div className="booking__step-content">
              <h2>Select a service</h2>
              <div className="booking__services">
                {services.map((service) => (
                  <button
                    key={service.slug}
                    type="button"
                    className={`booking__service ${
                      form.service_slug === service.slug ? 'booking__service--active' : ''
                    }`}
                    onClick={() => setForm((prev) => ({ ...prev, service_slug: service.slug }))}
                  >
                    <strong>{service.name}</strong>
                    <span>{service.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="booking__step-content">
              <h2>When should we arrive?</h2>
              <label htmlFor="scheduled_for">Preferred date & time</label>
              <input
                id="scheduled_for"
                type="datetime-local"
                value={form.scheduled_for}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, scheduled_for: event.target.value }))
                }
                min={new Date().toISOString().slice(0, 16)}
              />
              <label htmlFor="duration">Estimated duration (minutes)</label>
              <input
                id="duration"
                type="number"
                min={30}
                max={480}
                value={form.duration_minutes}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, duration_minutes: Number(event.target.value) }))
                }
              />
              <label htmlFor="notes">Extra details</label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder="Tell us about access instructions, parking, or special requests."
              />
            </div>
          )}

          {step === 2 && selectedService && (
            <div className="booking__step-content">
              <h2>Confirm your booking</h2>
              <dl className="booking__summary">
                <div>
                  <dt>Service</dt>
                  <dd>{selectedService.name}</dd>
                </div>
                <div>
                  <dt>Schedule</dt>
                  <dd>{new Date(form.scheduled_for).toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Duration</dt>
                  <dd>{form.duration_minutes} minutes</dd>
                </div>
                {form.notes ? (
                  <div>
                    <dt>Notes</dt>
                    <dd>{form.notes}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          )}

          {step === 3 && confirmation && (
            <div className="booking__step-content booking__step-content--success">
              <h2>Booking confirmed</h2>
              <p>Your reference is <strong>{confirmation.bookingId}</strong>.</p>
              <p>We will send you updates at {user?.email}.</p>
              <button
                type="button"
                className="booking__primary"
                onClick={() => router.push('/dashboard/client')}
              >
                View my bookings
              </button>
            </div>
          )}

          {step < 3 && (
            <footer className="booking__actions">
              {step > 0 ? (
                <button type="button" className="booking__ghost" onClick={handlePrevious}>
                  Back
                </button>
              ) : (
                <button type="button" className="booking__ghost" onClick={() => router.push('/')}
                >
                  Cancel
                </button>
              )}
              {step < 2 ? (
                <button type="button" className="booking__primary" onClick={handleNext}>
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  className="booking__primary"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Confirm booking'}
                </button>
              )}
            </footer>
          )}
        </div>
      </section>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const supabase = getSupabaseServerClient(ctx)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  ensureCsrfCookie(ctx)

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${encodeURIComponent('/book')}`,
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
