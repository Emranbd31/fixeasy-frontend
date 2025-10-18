import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import {
  ensureSupabaseConfig,
  getSupabaseConfig,
  launchOAuthSignIn,
  requestMagicLink,
  requestPhoneOtp,
  verifyPhoneOtp
} from '../../lib/supabaseClient'

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

const ROLE_OPTIONS = [
  { id: 'client', label: 'Client' },
  { id: 'pro', label: 'Professional' },
  { id: 'admin', label: 'Admin' }
]

const ROLE_REDIRECTS = {
  client: '/dashboard/client',
  pro: '/dashboard/pro',
  admin: '/dashboard/admin'
}

export default function SignupIndexPage() {
  const [selectedRole, setSelectedRole] = useState('client')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [loadingAction, setLoadingAction] = useState('')

  const supabaseConfig = useMemo(() => getSupabaseConfig(), [])
  const isSupabaseReady = supabaseConfig.isConfigured

  useEffect(() => {
    if (phoneOtpSent) {
      setPhoneOtpSent(false)
      setOtpCode('')
    }
  }, [phone])

  const persistRolePreference = (role) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fixeasy_role', role)
    }
  }

  const redirectUrl = () => {
    if (typeof window === 'undefined') return undefined
    return `${window.location.origin}/auth/redirect?role=${selectedRole}`
  }

  const handleStatus = (type, message) => setStatus({ type, message })

  const handleOAuth = async (provider) => {
    handleStatus('', '')
    setLoadingAction(provider)

    try {
      ensureSupabaseConfig()
      persistRolePreference(selectedRole)
      launchOAuthSignIn(provider, redirectUrl())
      handleStatus('info', 'Redirecting to secure authentication…')
    } catch (error) {
      handleStatus('error', error.message || 'Could not start authentication. Check Supabase configuration.')
      setLoadingAction('')
    }
  }

  const handleMagicLink = async (event) => {
    event.preventDefault()
    handleStatus('', '')
    setLoadingAction('email')

    try {
      ensureSupabaseConfig()
      persistRolePreference(selectedRole)
      await requestMagicLink(email.trim(), redirectUrl())
      handleStatus('success', 'Magic link sent. Check your inbox to continue with FixEasy.')
      setEmail('')
    } catch (error) {
      handleStatus('error', error.message || 'We could not send the magic link. Try again shortly.')
    } finally {
      setLoadingAction('')
    }
  }

  const handlePhoneSubmit = async (event) => {
    event.preventDefault()
    handleStatus('', '')

    if (!phoneOtpSent) {
      setLoadingAction('phone-send')
      try {
        ensureSupabaseConfig()
        await requestPhoneOtp(phone.trim())
        persistRolePreference(selectedRole)
        handleStatus('success', 'Verification code sent. Enter it below to finish signing in.')
        setPhoneOtpSent(true)
      } catch (error) {
        handleStatus('error', error.message || 'Could not send the verification code. Try again shortly.')
      } finally {
        setLoadingAction('')
      }
      return
    }

    setLoadingAction('phone-verify')
    try {
      ensureSupabaseConfig()
      persistRolePreference(selectedRole)
      await verifyPhoneOtp(phone.trim(), otpCode.trim())
      const destination = ROLE_REDIRECTS[selectedRole] || ROLE_REDIRECTS.client
      handleStatus('success', 'Verification successful. Redirecting to your dashboard…')
      if (typeof window !== 'undefined') {
        window.location.replace(destination)
      }
    } catch (error) {
      handleStatus('error', error.message || 'Incorrect verification code. Please try again.')
    } finally {
      setLoadingAction('')
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
                <img src={image.src} alt="" />
                <figcaption>{image.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section className="signup-index__auth" aria-labelledby="signup-auth-title">
          <div className="signup-index__auth-head">
            <span className="signup-index__eyebrow">Secure authentication</span>
            <h2 id="signup-auth-title">Continue with Supabase Auth</h2>
            <p>Choose your FixEasy role and sign in with an authentication method that suits you.</p>
          </div>

          <div className="signup-index__role-toggle" role="radiogroup" aria-label="Select your FixEasy role">
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selectedRole === option.id}
                className={`signup-index__role-button ${selectedRole === option.id ? 'is-active' : ''}`}
                onClick={() => {
                  setSelectedRole(option.id)
                  persistRolePreference(option.id)
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {status.message ? (
            <div className={`signup-index__status signup-index__status--${status.type || 'info'}`} role="status">
              {status.message}
            </div>
          ) : null}

          {!isSupabaseReady ? (
            <p className="signup-index__status signup-index__status--warning">
              Supabase environment variables are missing. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
              enable authentication flows.
            </p>
          ) : null}

          <div className="signup-index__auth-actions">
            <button
              type="button"
              className="signup-index__auth-button"
              onClick={() => handleOAuth('google')}
              disabled={!isSupabaseReady || Boolean(loadingAction)}
            >
              {loadingAction === 'google' ? 'Contacting Google…' : 'Continue with Google'}
            </button>
            <button
              type="button"
              className="signup-index__auth-button signup-index__auth-button--dark"
              onClick={() => handleOAuth('apple')}
              disabled={!isSupabaseReady || Boolean(loadingAction)}
            >
              {loadingAction === 'apple' ? 'Contacting Apple…' : 'Continue with Apple'}
            </button>
          </div>

          <div className="signup-index__divider" aria-hidden="true">
            <span>or continue with</span>
          </div>

          <form className="signup-index__form" onSubmit={handleMagicLink}>
            <label htmlFor="signup-email">Sign in with Email (Magic Link)</label>
            <div className="signup-index__form-row">
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={!isSupabaseReady || loadingAction === 'email'}
              />
              <button type="submit" disabled={!isSupabaseReady || loadingAction === 'email'}>
                {loadingAction === 'email' ? 'Sending…' : 'Send magic link'}
              </button>
            </div>
          </form>

          <form className="signup-index__form" onSubmit={handlePhoneSubmit}>
            <label htmlFor="signup-phone">Sign in with Phone (OTP)</label>
            <div className="signup-index__form-row">
              <input
                id="signup-phone"
                type="tel"
                placeholder="+353"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                disabled={!isSupabaseReady || loadingAction === 'phone-send' || loadingAction === 'phone-verify'}
              />
            </div>
            {phoneOtpSent ? (
              <div className="signup-index__form-row">
                <input
                  id="signup-phone-otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter code"
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value)}
                  required
                  disabled={!isSupabaseReady || loadingAction === 'phone-verify'}
                />
                <button type="submit" disabled={!isSupabaseReady || loadingAction === 'phone-verify'}>
                  {loadingAction === 'phone-verify' ? 'Verifying…' : 'Verify & sign in'}
                </button>
              </div>
            ) : (
              <div className="signup-index__form-row">
                <button type="submit" disabled={!isSupabaseReady || loadingAction === 'phone-send'}>
                  {loadingAction === 'phone-send' ? 'Sending code…' : 'Send verification code'}
                </button>
              </div>
            )}
          </form>
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
