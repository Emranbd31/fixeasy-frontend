import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { isValidIrishPhone, sanitizePhone, sanitizeText } from '../../lib/validation'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  acceptTerms: false
}

const loginProviders = [
  { id: 'google', label: 'Continue with Google' },
  { id: 'apple', label: 'Continue with Apple' },
  { id: 'email', label: 'Continue with Email' }
]

export default function ClientRegistration() {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!sanitizeText(formData.fullName)) {
      nextErrors.fullName = 'Enter your full name.'
    }

    if (!sanitizeText(formData.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Add a valid email address.'
    }

    if (!isValidIrishPhone(formData.phone)) {
      nextErrors.phone = 'Use an Irish contact number in +353 format.'
    }

    if (!sanitizeText(formData.address)) {
      nextErrors.address = 'Provide your address or Eircode.'
    }

    if (!sanitizeText(formData.password) || formData.password.length < 8) {
      nextErrors.password = 'Create a password with at least 8 characters.'
    }

    if (!formData.acceptTerms) {
      nextErrors.acceptTerms = 'You must agree to the FixEasy terms to continue.'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(false)
    setApiResponse(null)

    const validation = validate()
    if (Object.keys(validation).length) {
      setErrors(validation)
      return
    }

    setErrors({})
    setSubmitting(true)

    const payload = {
      fullName: sanitizeText(formData.fullName),
      email: sanitizeText(formData.email),
      phone: sanitizePhone(formData.phone),
      address: sanitizeText(formData.address),
      password: formData.password,
      marketingConsent: false,
      acceptTerms: formData.acceptTerms
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'client',
          payload
        })
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        setErrors({ form: result?.error ?? 'We were unable to submit your details. Try again shortly.' })
        return
      }

      setSubmitted(true)
      setApiResponse({ ...result, email: payload.email })
      setFormData(initialState)
    } catch (error) {
      setErrors({ form: 'We could not reach the onboarding service. Check your connection and try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="registration-layout">
      <Head>
        <title>Join FixEasy — Client Registration</title>
        <meta
          name="description"
          content="Create a FixEasy client account in minutes. Secure registration with encrypted data protection across Ireland."
        />
      </Head>

      <div className="registration-layout__container">
        <header className="registration-header">
          <span className="registration-header__eyebrow">Client onboarding</span>
          <h1 className="registration-header__title">Trusted Professionals. Verified for Your Peace of Mind.</h1>
          <p className="registration-header__intro">
            Book FixEasy services with a secure profile so every visit, update, and payment is protected.
          </p>
        </header>

        <div className="registration-grid">
          <section className="registration-card" aria-labelledby="client-register-heading">
            <div className="registration-card__intro">
              <h2 id="client-register-heading" className="registration-card__title">
                Create your secure FixEasy account
              </h2>
              <p className="registration-note">Your information is encrypted and never shared.</p>
            </div>

            <div className="registration-login-options" role="group" aria-label="Quick login options">
              {loginProviders.map((provider) => (
                <button key={provider.id} type="button" className="registration-login-options__button">
                  {provider.label}
                </button>
              ))}
            </div>

            <div className="registration-divider" role="presentation">
              <span>or</span>
            </div>

            {errors.form ? (
              <div className="registration-errors" role="alert">
                {errors.form}
              </div>
            ) : null}

            {submitted && apiResponse ? (
              <div className="registration-success" role="status">
                <p>Thank you! We have created your FixEasy client profile.</p>
                <p>
                  A confirmation email has been sent to <strong>{apiResponse.email}</strong>. Follow the
                  link inside to finish verifying your account.
                </p>
              </div>
            ) : null}

            <form className="registration-form" onSubmit={handleSubmit} noValidate>
              <div className="registration-field">
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  required
                />
                {errors.fullName ? <p className="registration-hint registration-hint--error">{errors.fullName}</p> : null}
              </div>

              <div className="registration-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  required
                />
                {errors.email ? <p className="registration-hint registration-hint--error">{errors.email}</p> : null}
              </div>

              <div className="registration-field">
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+353871234567"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.phone)}
                  required
                />
                {errors.phone ? <p className="registration-hint registration-hint--error">{errors.phone}</p> : null}
              </div>

              <div className="registration-field">
                <label htmlFor="address">Address / Eircode</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  aria-invalid={Boolean(errors.address)}
                  required
                />
                {errors.address ? <p className="registration-hint registration-hint--error">{errors.address}</p> : null}
              </div>

              <div className="registration-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                  required
                />
                <p className="registration-hint">Use at least 8 characters including a mix of letters and numbers.</p>
                {errors.password ? <p className="registration-hint registration-hint--error">{errors.password}</p> : null}
              </div>

              <div className="registration-consent">
                <label htmlFor="acceptTerms" className="registration-consent__label">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.acceptTerms)}
                    required
                  />
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" rel="noopener noreferrer">
                    FixEasy Terms &amp; Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </Link>
                  .
                </label>
                {errors.acceptTerms ? (
                  <p className="registration-hint registration-hint--error">{errors.acceptTerms}</p>
                ) : null}
              </div>

              <button type="submit" className="registration-submit" disabled={submitting} aria-busy={submitting}>
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          </section>

          <aside className="registration-aside" aria-label="Why FixEasy">
            <div className="registration-aside__card">
              <h2 className="registration-aside__title">Why clients trust FixEasy</h2>
              <ul className="registration-aside__list">
                <li>Professionals are ID-verified and fully insured.</li>
                <li>Track every booking with real-time arrival updates.</li>
                <li>Dedicated Irish support available 24/7.</li>
              </ul>
            </div>

            <div className="registration-aside__card registration-helpline">
              <strong>Need assistance?</strong>
              <span>
                Email <a href="mailto:support@fixeasy.irish">support@fixeasy.irish</a> or call{' '}
                <a href="tel:+35319638020">+353 1 963 8020</a>.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
