import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { isValidIrishPhone, sanitizePhone, sanitizeText } from '../../lib/validation'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  serviceType: '',
  otherService: '',
  problemDetails: '',
  acceptTerms: false
}

const loginProviders = [
  { id: 'google', label: 'Continue with Google' },
  { id: 'apple', label: 'Continue with Apple' },
  { id: 'email', label: 'Continue with Email' }
]

const serviceOptions = [
  'Handyman',
  'Electrician',
  'Cleaner',
  'Gardener',
  'Plumber',
  'Security & CCTV Installation',
  'Smart Home Automation',
  'Flooring & Tiling',
  'Other (please specify)'
]

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_BUCKET || 'client-uploads'

export default function ClientRegistration() {
  const router = useRouter()
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const [issuePhoto, setIssuePhoto] = useState(null)
  const [issuePreview, setIssuePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }))
  }

  useEffect(() => {
    const { service } = router.query
    if (typeof service === 'string' && service.trim().length > 0) {
      setFormData((prev) => ({
        ...prev,
        serviceType: serviceOptions.includes(service) ? service : 'Other (please specify)',
        otherService: serviceOptions.includes(service) ? prev.otherService : service
      }))
    }
  }, [router.query])

  useEffect(() => {
    return () => {
      if (issuePreview) {
        URL.revokeObjectURL(issuePreview)
      }
    }
  }, [issuePreview])

  const handleServiceChange = (event) => {
    const { value } = event.target
    setFormData((prev) => ({
      ...prev,
      serviceType: value,
      otherService: value === 'Other (please specify)' ? prev.otherService : ''
    }))
    setErrors((prev) => ({ ...prev, serviceType: undefined, otherService: undefined }))
  }

  const handleProviderClick = (providerId) => {
    if (typeof window === 'undefined') {
      return
    }

    if (providerId === 'email') {
      const emailField = document.getElementById('email')
      emailField?.focus()
      return
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setErrors((prev) => ({
        ...prev,
        form: 'Supabase OAuth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.'
      }))
      return
    }

    const state = window.crypto?.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36)
    window.sessionStorage.setItem('fixeasy_oauth_state', state)

    const redirectTo = `${window.location.origin}/dashboard/client`
    const authorizeUrl = new URL(`${SUPABASE_URL}/auth/v1/authorize`)
    authorizeUrl.searchParams.set('provider', providerId)
    authorizeUrl.searchParams.set('redirect_to', redirectTo)
    authorizeUrl.searchParams.set('scopes', 'email profile openid')
    authorizeUrl.searchParams.set('state', state)
    authorizeUrl.searchParams.set('flow_type', 'pkce')

    window.location.href = authorizeUrl.toString()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setIssuePhoto(null)
      if (issuePreview) {
        URL.revokeObjectURL(issuePreview)
        setIssuePreview(null)
      }
      return
    }

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, issuePhoto: 'Upload a JPG, PNG, or WEBP image.' }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, issuePhoto: 'Images must be 5MB or smaller.' }))
      return
    }

    if (issuePreview) {
      URL.revokeObjectURL(issuePreview)
    }

    setErrors((prev) => ({ ...prev, issuePhoto: undefined }))
    setIssuePhoto(file)
    setIssuePreview(URL.createObjectURL(file))
  }

  const uploadIssuePhoto = async () => {
    if (!issuePhoto) {
      return null
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase Storage is not configured for uploads.')
    }

    setUploading(true)

    const safeFileName = issuePhoto.name.replace(/[^a-zA-Z0-9.\-]/g, '_')
    const path = `service-issues/${Date.now()}-${safeFileName}`

    const body = new FormData()
    body.append('file', issuePhoto)
    body.append('path', path)
    try {
      const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'x-upsert': 'true',
          'x-metadata': JSON.stringify({
            service: formData.serviceType || 'other',
            service_detail: formData.otherService || '',
            submitted_at: new Date().toISOString()
          })
        },
        body
      })

      if (!response.ok) {
        let message = 'Image upload failed. Try again shortly.'
        try {
          const errorPayload = await response.json()
          if (errorPayload?.message) {
            message = errorPayload.message
          }
        } catch (error) {
          // ignore
        }
        throw new Error(message)
      }

      return {
        path,
        publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`
      }
    } finally {
      setUploading(false)
    }
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

    if (!sanitizeText(formData.serviceType)) {
      nextErrors.serviceType = 'Select the service you need.'
    }

    if (formData.serviceType === 'Other (please specify)' && !sanitizeText(formData.otherService)) {
      nextErrors.otherService = 'Describe the service or expertise you require.'
    }

    if (!sanitizeText(formData.problemDetails) || sanitizeText(formData.problemDetails).length < 20) {
      nextErrors.problemDetails = 'Provide a short description of the issue (at least 20 characters).'
    }

    if (!sanitizeText(formData.password) || formData.password.length < 8) {
      nextErrors.password = 'Create a password with at least 8 characters.'
    }

    if (!formData.acceptTerms) {
      nextErrors.acceptTerms = 'You must agree to the FixEasy terms to continue.'
    }

    if (issuePhoto && issuePhoto.size > 5 * 1024 * 1024) {
      nextErrors.issuePhoto = 'Images must be 5MB or smaller.'
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

    let uploadedAsset = null
    try {
      uploadedAsset = await uploadIssuePhoto()
    } catch (uploadError) {
      setErrors((prev) => ({ ...prev, issuePhoto: uploadError.message }))
      setSubmitting(false)
      return
    }

    const payload = {
      fullName: sanitizeText(formData.fullName),
      email: sanitizeText(formData.email),
      phone: sanitizePhone(formData.phone),
      address: sanitizeText(formData.address),
      password: formData.password,
      serviceType: sanitizeText(formData.serviceType),
      otherServiceDescription: sanitizeText(formData.otherService),
      problemDetails: sanitizeText(formData.problemDetails),
      issuePhoto: uploadedAsset?.path ?? '',
      issuePhotoUrl: uploadedAsset?.publicUrl ?? '',
      marketingConsent: false,
      acceptTerms: formData.acceptTerms
    }

    try {
      const response = await fetch('/api/register/client-intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        setErrors({ form: result?.error ?? 'We were unable to submit your details. Try again shortly.' })
        return
      }

      setSubmitted(true)
      setApiResponse({ ...result, email: payload.email })
      setFormData(initialState)
      setIssuePhoto(null)
      if (issuePreview) {
        URL.revokeObjectURL(issuePreview)
        setIssuePreview(null)
      }
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
                <button
                  key={provider.id}
                  type="button"
                  className="registration-login-options__button"
                  onClick={() => handleProviderClick(provider.id)}
                >
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
                <label htmlFor="serviceType">Service requested</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleServiceChange}
                  aria-invalid={Boolean(errors.serviceType)}
                  required
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.serviceType ? (
                  <p className="registration-hint registration-hint--error">{errors.serviceType}</p>
                ) : (
                  <p className="registration-hint">We will match you with a verified professional for this service.</p>
                )}
              </div>

              {formData.serviceType === 'Other (please specify)' ? (
                <div className="registration-field">
                  <label htmlFor="otherService">Describe your service or expertise</label>
                  <input
                    id="otherService"
                    name="otherService"
                    type="text"
                    value={formData.otherService}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.otherService)}
                    placeholder="e.g. Heritage stone restoration"
                  />
                  {errors.otherService ? (
                    <p className="registration-hint registration-hint--error">{errors.otherService}</p>
                  ) : (
                    <p className="registration-hint">Tell us what you need and we will route it to the right team.</p>
                  )}
                </div>
              ) : null}

              <div className="registration-field">
                <label htmlFor="problemDetails">Describe your issue</label>
                <textarea
                  id="problemDetails"
                  name="problemDetails"
                  rows={4}
                  value={formData.problemDetails}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.problemDetails)}
                  placeholder="Tell us what is happening, any access information, or timing needs."
                  required
                />
                {errors.problemDetails ? (
                  <p className="registration-hint registration-hint--error">{errors.problemDetails}</p>
                ) : (
                  <p className="registration-hint">The more detail you share, the faster we can resolve the issue.</p>
                )}
              </div>

              <div className="registration-field registration-field--upload">
                <label htmlFor="issuePhoto">Upload a photo (optional)</label>
                <input
                  id="issuePhoto"
                  name="issuePhoto"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  aria-describedby="issue-photo-hint"
                />
                {issuePreview ? (
                  <div className="registration-upload__preview">
                    <img src={issuePreview} alt="Preview of the uploaded issue" />
                  </div>
                ) : null}
                <p id="issue-photo-hint" className="registration-hint">
                  Share a quick photo so we can pre-diagnose the issue. JPG, PNG, or WEBP up to 5MB.
                </p>
                {errors.issuePhoto ? (
                  <p className="registration-hint registration-hint--error">{errors.issuePhoto}</p>
                ) : null}
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

              <button
                type="submit"
                className="registration-submit"
                disabled={submitting || uploading}
                aria-busy={submitting || uploading}
              >
                {submitting || uploading ? 'Sending details…' : 'Create account'}
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
