import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SERVICE_OPTIONS, findServiceByName } from '../../data/services'
import { isValidIrishPhone, sanitizePhone, sanitizeText } from '../../lib/validation'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  serviceType: '',
  otherService: '',
  issueDetails: ''
}

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_BUCKET || 'client-uploads'

export default function ClientBooking() {
  const router = useRouter()
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [issuePhoto, setIssuePhoto] = useState(null)
  const [issuePreview, setIssuePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const { service } = router.query
    if (typeof service !== 'string') {
      return
    }

    const decoded = decodeURIComponent(service)
    const knownService = findServiceByName(decoded)
    setFormData((prev) => ({
      ...prev,
      serviceType: knownService ? knownService.name : 'Other (please specify)',
      otherService: knownService ? prev.otherService : decoded
    }))
  }, [router.query])

  useEffect(() => {
    return () => {
      if (issuePreview) {
        URL.revokeObjectURL(issuePreview)
      }
    }
  }, [issuePreview])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }))
  }

  const handleServiceChange = (event) => {
    const { value } = event.target
    setFormData((prev) => ({
      ...prev,
      serviceType: value,
      otherService: value === 'Other (please specify)' ? prev.otherService : ''
    }))
    setErrors((prev) => ({ ...prev, serviceType: undefined, otherService: undefined }))
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
          // ignore JSON parse errors
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
      nextErrors.otherService = 'Describe the service you need.'
    }

    if (!sanitizeText(formData.issueDetails) || sanitizeText(formData.issueDetails).length < 20) {
      nextErrors.issueDetails = 'Add a short description so we understand the problem.'
    }

    if (issuePhoto && issuePhoto.size > 5 * 1024 * 1024) {
      nextErrors.issuePhoto = 'Images must be 5MB or smaller.'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(false)

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
      serviceType: sanitizeText(formData.serviceType),
      otherServiceDescription: sanitizeText(formData.otherService),
      issueDetails: sanitizeText(formData.issueDetails),
      issuePhoto: uploadedAsset?.path ?? '',
      issuePhotoUrl: uploadedAsset?.publicUrl ?? ''
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
      setFormData(initialState)
      setIssuePhoto(null)
      if (issuePreview) {
        URL.revokeObjectURL(issuePreview)
        setIssuePreview(null)
      }
    } catch (error) {
      setErrors({ form: 'We could not reach the booking service. Check your connection and try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="registration-layout registration-layout--booking">
      <Head>
        <title>Book a FixEasy Professional</title>
        <meta
          name="description"
          content="Submit a FixEasy service request in minutes. Verified Irish professionals ready to help with plumbing, electrical, cleaning, and more."
        />
      </Head>

      <div className="registration-layout__container">
        <header className="registration-header">
          <span className="registration-header__eyebrow">Book a service</span>
          <h1 className="registration-header__title">Trusted Professionals. Verified for Your Peace of Mind.</h1>
          <p className="registration-header__intro">
            Tell us what you need and our Dublin-based team will match you with a verified professional for fast, secure support.
          </p>
        </header>

        <div className="registration-grid">
          <section className="registration-card" aria-labelledby="client-booking-heading">
            <div className="registration-card__intro">
              <h2 id="client-booking-heading" className="registration-card__title">
                Book Now
              </h2>
              <p className="registration-note">Complete the form and we will confirm availability within the hour.</p>
            </div>

            {errors.form ? (
              <div className="registration-errors" role="alert">
                {errors.form}
              </div>
            ) : null}

            {submitted ? (
              <div className="registration-success" role="status">
                <p>Thank you. Your request has been received.</p>
                <p>Our team will contact you shortly to finalise the booking details.</p>
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

              <div className="registration-two-column">
                <div className="registration-field">
                  <label htmlFor="email">Email</label>
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
                  <label htmlFor="phone">Phone</label>
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
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.serviceType ? (
                  <p className="registration-hint registration-hint--error">{errors.serviceType}</p>
                ) : (
                  <p className="registration-hint">We will match you with a FixEasy professional for this job.</p>
                )}
              </div>

              {formData.serviceType === 'Other (please specify)' ? (
                <div className="registration-field">
                  <label htmlFor="otherService">Describe your service</label>
                  <input
                    id="otherService"
                    name="otherService"
                    type="text"
                    value={formData.otherService}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.otherService)}
                    placeholder="e.g. Heritage stone restoration"
                    required
                  />
                  {errors.otherService ? (
                    <p className="registration-hint registration-hint--error">{errors.otherService}</p>
                  ) : (
                    <p className="registration-hint">Include any special skills or equipment required.</p>
                  )}
                </div>
              ) : null}

              <div className="registration-field">
                <label htmlFor="issueDetails">Describe your issue</label>
                <textarea
                  id="issueDetails"
                  name="issueDetails"
                  rows={4}
                  value={formData.issueDetails}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.issueDetails)}
                  placeholder="Share key details, timings, and access notes."
                  required
                />
                {errors.issueDetails ? (
                  <p className="registration-hint registration-hint--error">{errors.issueDetails}</p>
                ) : (
                  <p className="registration-hint">Clear notes help us schedule the right FixEasy professional.</p>
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
                  Attach a quick photo to help us triage your request faster.
                </p>
                {errors.issuePhoto ? (
                  <p className="registration-hint registration-hint--error">{errors.issuePhoto}</p>
                ) : null}
              </div>

              <button
                type="submit"
                className="registration-submit"
                disabled={submitting || uploading}
                aria-busy={submitting || uploading}
              >
                {submitting || uploading ? 'Submitting…' : 'Submit Request'}
              </button>
            </form>
          </section>

          <aside className="registration-aside" aria-label="Why FixEasy">
            <div className="registration-aside__card">
              <h2 className="registration-aside__title">Why FixEasy?</h2>
              <ul className="registration-aside__list">
                <li>All professionals are ID-verified and insured for Irish regulations.</li>
                <li>Same-day response for priority jobs across Dublin and Leinster.</li>
                <li>Secure payments and 24/7 local support.</li>
              </ul>
            </div>

            <div className="registration-aside__card registration-helpline">
              <strong>Need a quicker response?</strong>
              <span>
                Call <a href="tel:+35319638020">+353 1 963 8020</a> or email{' '}
                <a href="mailto:support@fixeasy.irish">support@fixeasy.irish</a>.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
