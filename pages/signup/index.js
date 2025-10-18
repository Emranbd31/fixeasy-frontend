import { useMemo, useState } from 'react'
import Head from 'next/head'
import {
  hasSupabaseConfig,
  requestPhoneOtp,
  roleRedirectMap,
  signInWithMagicLink,
  startOAuth,
  verifyPhoneOtp
} from '../../lib/supabase-auth'
import { isValidIrishPhone, sanitizePhone } from '../../lib/validation'

const cards = [
  {
    title: 'Client account',
    description:
      'Book vetted professionals, manage appointments, and access invoices from any device with MFA security.',
    href: '/signup/client'
  },
  {
    title: 'Professional account',
    description:
      'Complete compliance onboarding, connect Stripe payouts, and receive job offers in your preferred areas.',
    href: '/signup/pro'
  }
]

const ROLE_OPTIONS = [
  {
    id: 'client',
    label: 'Client — book services',
    helper: 'Track bookings, invoices, and concierge updates.'
  },
  {
    id: 'pro',
    label: 'Professional — join the network',
    helper: 'Complete onboarding, accept jobs, and manage payouts.'
  },
  {
    id: 'admin',
    label: 'Admin — operations team',
    helper: 'Manage verifications, escalations, and live support.'
  }
]

const WORK_ENV_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    alt: 'FixEasy electrician wiring a panel'
  },
  {
    src: 'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?auto=format&fit=crop&w=800&q=80',
    alt: 'Professional cleaner preparing equipment'
  },
  {
    src: 'https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=800&q=80',
    alt: 'Gardening crew maintaining a landscaped garden'
  },
  {
    src: 'https://images.unsplash.com/photo-1523419409543-0f1a97ed8c68?auto=format&fit=crop&w=800&q=80',
    alt: 'Carpenter measuring cabinetry installation'
  }
]

export default function SignupIndexPage() {
  const [selectedRole, setSelectedRole] = useState('client')
  const [oauthError, setOauthError] = useState('')
  const [loadingProvider, setLoadingProvider] = useState('')
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState({ type: '', message: '' })
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [phoneStatus, setPhoneStatus] = useState({ type: '', message: '' })
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  const redirectDescription = useMemo(() => {
    const path = roleRedirectMap[selectedRole]
    if (!path) return ''
    return `You will be redirected to ${path}.`
  }, [selectedRole])

  const resetEmailStatus = () => setEmailStatus({ type: '', message: '' })
  const resetPhoneStatus = () => setPhoneStatus({ type: '', message: '' })

  const handleOAuth = (provider) => {
    setOauthError('')
    setLoadingProvider(provider)

    try {
      startOAuth(provider, selectedRole)
    } catch (error) {
      setOauthError(error.message || 'Could not start authentication. Check your Supabase configuration.')
      setLoadingProvider('')
    }
  }

  const handleMagicLinkSubmit = async (event) => {
    event.preventDefault()
    resetEmailStatus()

    if (!email.trim()) {
      setEmailStatus({ type: 'error', message: 'Enter your email address to receive a magic link.' })
      return
    }

    setIsSendingMagicLink(true)
    try {
      await signInWithMagicLink(email.trim(), selectedRole)
      setEmailStatus({
        type: 'success',
        message: 'Magic link sent. Check your inbox to finish signing in.'
      })
    } catch (error) {
      setEmailStatus({ type: 'error', message: error.message || 'Could not send a magic link.' })
    } finally {
      setIsSendingMagicLink(false)
    }
  }

  const handleSendOtp = async (event) => {
    event.preventDefault()
    resetPhoneStatus()

    const sanitized = sanitizePhone(phone)
    if (!isValidIrishPhone(sanitized)) {
      setPhoneStatus({ type: 'error', message: 'Use a valid Irish phone number in +353 format.' })
      return
    }

    setIsSendingOtp(true)
    try {
      await requestPhoneOtp(sanitized, selectedRole)
      setOtpSent(true)
      setPhoneStatus({ type: 'success', message: 'Verification code sent. Enter it below to continue.' })
    } catch (error) {
      setPhoneStatus({ type: 'error', message: error.message || 'Could not send verification code.' })
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    resetPhoneStatus()

    if (!otp.trim()) {
      setPhoneStatus({ type: 'error', message: 'Enter the verification code from your SMS.' })
      return
    }

    setIsVerifyingOtp(true)
    try {
      await verifyPhoneOtp(sanitizePhone(phone), otp.trim(), selectedRole)
      setPhoneStatus({ type: 'success', message: 'Phone verified. Redirecting…' })
    } catch (error) {
      setPhoneStatus({ type: 'error', message: error.message || 'Verification failed. Try again.' })
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  return (
    <>
      <Head>
        <title>Create your FixEasy account</title>
        <meta
          name="description"
          content="Choose a FixEasy client or professional account to start booking or delivering trusted services."
        />
      </Head>
      <main className="signup-index">
        <section className="signup-index__hero">
          <div className="signup-index__copy">
            <span className="signup-index__eyebrow">Start with FixEasy</span>
            <h1>Create your FixEasy account</h1>
            <p>
              Choose the workflow that suits you — clients unlock guided bookings and live support, while professionals join a
              vetted network with verified payouts and job alerts.
            </p>
          </div>
          <div className="signup-index__gallery" aria-hidden="true">
            {WORK_ENV_IMAGES.map((image, index) => (
              <figure key={`${image.src}-${index}`} className="signup-index__gallery-item">
                <img
                  src={image.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    const fallback = WORK_ENV_IMAGES[0]?.src
                    if (fallback && event.currentTarget.src !== fallback) {
                      event.currentTarget.src = fallback
                    }
                  }}
                />
                <figcaption>{image.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="signup-index__auth" aria-labelledby="signup-auth-heading">
          <div className="signup-index__auth-card">
            <div className="signup-index__auth-head">
              <span className="signup-index__eyebrow">Secure sign-in</span>
              <h2 id="signup-auth-heading">Continue with Supabase Auth</h2>
              <p>
                Choose your role and use your preferred authentication method. {redirectDescription}
              </p>
            </div>

            <fieldset className="signup-index__roles">
              <legend className="signup-index__roles-label">Select your workspace</legend>
              <div className="signup-index__roles-grid">
                {ROLE_OPTIONS.map((role) => (
                  <label key={role.id} className={`signup-index__role ${selectedRole === role.id ? 'is-active' : ''}`}>
                    <input
                      type="radio"
                      name="signup-role"
                      value={role.id}
                      checked={selectedRole === role.id}
                      onChange={() => setSelectedRole(role.id)}
                    />
                    <span className="signup-index__role-title">{role.label}</span>
                    <span className="signup-index__role-helper">{role.helper}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="signup-index__oauth">
              <button
                type="button"
                className="signup-index__oauth-btn signup-index__oauth-btn--google"
                onClick={() => handleOAuth('google')}
                disabled={!!loadingProvider || !hasSupabaseConfig}
              >
                {loadingProvider === 'google' ? 'Opening Google…' : 'Continue with Google'}
              </button>
              <button
                type="button"
                className="signup-index__oauth-btn signup-index__oauth-btn--apple"
                onClick={() => handleOAuth('apple')}
                disabled={!!loadingProvider || !hasSupabaseConfig}
              >
                {loadingProvider === 'apple' ? 'Opening Apple…' : 'Continue with Apple'}
              </button>
            </div>
            {oauthError ? <p className="signup-index__auth-error">{oauthError}</p> : null}
            {!hasSupabaseConfig ? (
              <p className="signup-index__auth-warning">
                Supabase credentials are required to enable authentication. Add NEXT_PUBLIC_SUPABASE_URL and
                NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.
              </p>
            ) : null}

            <div className="signup-index__divider" role="presentation">
              <span>or use email / phone</span>
            </div>

            <form className="signup-index__form" onSubmit={handleMagicLinkSubmit}>
              <label htmlFor="signup-email">Sign in with Email (Magic Link)</label>
              <div className="signup-index__form-row">
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    resetEmailStatus()
                  }}
                  disabled={isSendingMagicLink || !hasSupabaseConfig}
                />
                <button type="submit" disabled={isSendingMagicLink || !hasSupabaseConfig}>
                  {isSendingMagicLink ? 'Sending…' : 'Send magic link'}
                </button>
              </div>
              {emailStatus.message ? (
                <p className={`signup-index__form-hint signup-index__form-hint--${emailStatus.type}`}>
                  {emailStatus.message}
                </p>
              ) : null}
            </form>

            <form className="signup-index__form" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
              <label htmlFor="signup-phone">Sign in with Phone (OTP)</label>
              <div className="signup-index__form-row">
                <input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+353"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value)
                    resetPhoneStatus()
                  }}
                  disabled={(otpSent && !isVerifyingOtp) || !hasSupabaseConfig}
                />
                <button
                  type="submit"
                  disabled={!hasSupabaseConfig || (otpSent ? isVerifyingOtp : isSendingOtp)}
                >
                  {otpSent ? (isVerifyingOtp ? 'Verifying…' : 'Verify code') : isSendingOtp ? 'Sending…' : 'Send code'}
                </button>
              </div>

              {otpSent ? (
                <div className="signup-index__form-row signup-index__form-row--stacked">
                  <input
                    id="signup-otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
                    disabled={isVerifyingOtp}
                  />
                </div>
              ) : null}

              {phoneStatus.message ? (
                <p className={`signup-index__form-hint signup-index__form-hint--${phoneStatus.type}`}>
                  {phoneStatus.message}
                </p>
              ) : null}
            </form>
          </div>
        </section>

        <section className="signup-index__grid">
          {cards.map((card) => (
            <a key={card.title} href={card.href} className="signup-index__card">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <span aria-hidden="true">Continue &rarr;</span>
            </a>
          ))}
        </section>
      </main>
    </>
  )
}
