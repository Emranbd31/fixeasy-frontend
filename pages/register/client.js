import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SERVICE_OPTIONS, findServiceByName } from '../../data/services'
import { isValidIrishPhone, sanitizePhone, sanitizeText } from '../../lib/validation'

const EMAIL_REGEX = /^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/
const OTHER_OPTION = 'Other (please specify)'

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
  const [submissionError, setSubmissionError] = useState('')
  const [reference, setReference] = useState('')
  const [issuePreview, setIssuePreview] = useState(null)
  const [issueUpload, setIssueUpload] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    const { service } = router.query
    if (typeof service !== 'string') return

    const decoded = decodeURIComponent(service)
    const knownService = findServiceByName(decoded)
    setFormData((prev) => ({
      ...prev,
      serviceType: knownService ? knownService.name : OTHER_OPTION,
      otherService: knownService ? prev.otherService : decoded
    }))
  }, [router.query])

  useEffect(() => {
    return () => {
      if (issuePreview) URL.revokeObjectURL(issuePreview)
    }
  }, [issuePreview])

  const serviceTypeLabel = useMemo(() => sanitizeText(formData.serviceType), [formData.serviceType])
  const requiresOtherDetail = serviceTypeLabel === OTHER_OPTION

  const updateField = (key) => (event) => {
    const value = event.target.value
    setFormData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleServiceChange = (event) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      serviceType: value,
      otherService: value === OTHER_OPTION ? prev.otherService : ''
    }))
    setErrors((prev) => ({ ...prev, serviceType: undefined, otherService: undefined }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!sanitizeText(formData.fullName)) {
      nextErrors.fullName = 'Enter your full name.'
    }

    if (!sanitizeText(formData.email) || !EMAIL_REGEX.test(formData.email.trim().toLowerCase())) {
      nextErrors.email = 'Provide a valid contact email.'
    }

    if (!isValidIrishPhone(formData.phone)) {
      nextErrors.phone = 'Use an Irish contact number in +353 format.'
    }

    if (!sanitizeText(formData.address)) {
      nextErrors.address = 'Include an address or Eircode so we can route the job.'
    }

    if (!sanitizeText(formData.serviceType)) {
      nextErrors.serviceType = 'Select the service you need support with.'
    }

    if (requiresOtherDetail && !sanitizeText(formData.otherService)) {
      nextErrors.otherService = 'Describe the service or expertise you require.'
    }

    if (!sanitizeText(formData.issueDetails) || sanitizeText(formData.issueDetails).length < 20) {
      nextErrors.issueDetails = 'Describe the issue so we can triage correctly (20+ characters).'
    }

    return nextErrors
  }

  const uploadIssuePhoto = async (file) => {
    if (!file) return null

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        path: '',
        url: ''
      }
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')
    const path = `client-intake/${Date.now()}-${safeName}`
    const body = new FormData()
    body.append('file', file)
    body.append('path', path)

    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'x-upsert': 'true'
      },
      body
    })

    if (!response.ok) {
      throw new Error('Upload failed. Try again shortly.')
    }

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      path,
      url: `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`
    }
  }

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0]
    setErrors((prev) => ({ ...prev, issuePhoto: undefined }))
    setSubmissionError('')

    if (issuePreview) URL.revokeObjectURL(issuePreview)
    setIssuePreview(null)
    setIssueUpload(null)

    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase()
    const allowed = ['jpg', 'jpeg', 'png', 'heic']
    const sizeLimit = 6 * 1024 * 1024

    if (!allowed.includes(extension)) {
      setErrors((prev) => ({ ...prev, issuePhoto: 'Upload a JPG, PNG, or HEIC image.' }))
      return
    }

    if (file.size > sizeLimit) {
      setErrors((prev) => ({ ...prev, issuePhoto: 'Files must be 6MB or smaller.' }))
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setIssuePreview(previewUrl)
    setUploading(true)
    setUploadProgress(10)

    try {
      const uploaded = await uploadIssuePhoto(file)
      setIssueUpload(uploaded)
      setUploadProgress(100)
    } catch (error) {
      console.error('Upload error:', error)
      setErrors((prev) => ({ ...prev, issuePhoto: error.message || 'Upload failed. Try again.' }))
      setIssuePreview(null)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1500)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmissionError('')
    setSubmitted(false)
    setReference('')

    const validation = validate()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setErrors({})
    setSubmitting(true)

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: sanitizePhone(formData.phone),
      address: formData.address,
      serviceType: formData.serviceType,
      otherServiceDescription: formData.otherService,
      issueDetails: formData.issueDetails,
      issuePhoto: issueUpload,
      issuePhotoUrl: issueUpload?.url ?? ''
    }

    try {
      const response = await fetch('/api/form/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok || data?.ok !== true) {
        throw new Error(data?.error || 'Could not submit your request.')
      }

      setSubmitted(true)
      setReference(data.reference || '')
      setFormData(initialState)
      setIssueUpload(null)
      if (issuePreview) URL.revokeObjectURL(issuePreview)
      setIssuePreview(null)
    } catch (error) {
      setSubmissionError(error.message || 'Something went wrong. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="registration-layout registration-layout--booking">
      <Head>
        <title>Book a FixEasy Service — Verified Home & Workplace Professionals</title>
      </Head>
      <div className="registration-layout__container">
        <header className="registration-header">
          <span className="registration-header__eyebrow">Client booking</span>
          <h1 className="registration-header__title">Tell us what needs fixing</h1>
          <p className="registration-header__intro">
            Share the details of your job and we will assign a vetted professional. You will receive confirmation, arrival time,
            and secure payment links directly from FixEasy.
          </p>
        </header>

        <div className="registration-grid">
          <form className="registration-card" onSubmit={handleSubmit} noValidate>
            <div className="registration-card__intro">
              <h2 className="registration-card__title">Your details</h2>
              <p className="registration-hint">
                We only use your information to schedule the visit and share status updates.
              </p>
            </div>

            {submissionError ? <div className="registration-errors">{submissionError}</div> : null}
            {submitted ? (
              <div className="registration-success" role="status">
                <span>Thanks! We have your booking request.</span>
                {reference ? <span>Your reference: {reference}</span> : null}
              </div>
            ) : null}

            <fieldset className="registration-fieldset">
              <legend>Contact information</legend>
              <div className="registration-field">
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={updateField('fullName')}
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
                    autoComplete="email"
                    value={formData.email}
                    onChange={updateField('email')}
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
                    autoComplete="tel"
                    placeholder="+353"
                    value={formData.phone}
                    onChange={updateField('phone')}
                    required
                  />
                  {errors.phone ? <p className="registration-hint registration-hint--error">{errors.phone}</p> : null}
                </div>
              </div>

              <div className="registration-field">
                <label htmlFor="address">Address or Eircode</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  value={formData.address}
                  onChange={updateField('address')}
                  required
                />
                {errors.address ? <p className="registration-hint registration-hint--error">{errors.address}</p> : null}
              </div>
            </fieldset>

            <fieldset className="registration-fieldset">
              <legend>Service details</legend>
              <div className="registration-field">
                <label htmlFor="serviceType">Service needed</label>
                <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleServiceChange} required>
                  <option value="">Select a service</option>
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.serviceType ? <p className="registration-hint registration-hint--error">{errors.serviceType}</p> : null}
              </div>

              {requiresOtherDetail ? (
                <div className="registration-field">
                  <label htmlFor="otherService">Describe the service</label>
                  <input
                    id="otherService"
                    name="otherService"
                    type="text"
                    value={formData.otherService}
                    onChange={updateField('otherService')}
                    required
                  />
                  {errors.otherService ? (
                    <p className="registration-hint registration-hint--error">{errors.otherService}</p>
                  ) : (
                    <p className="registration-hint">Let us know the exact skill or expertise you are looking for.</p>
                  )}
                </div>
              ) : null}

              <div className="registration-field">
                <label htmlFor="issueDetails">What needs attention?</label>
                <textarea
                  id="issueDetails"
                  name="issueDetails"
                  rows={5}
                  value={formData.issueDetails}
                  onChange={updateField('issueDetails')}
                  required
                />
                {errors.issueDetails ? (
                  <p className="registration-hint registration-hint--error">{errors.issueDetails}</p>
                ) : (
                  <p className="registration-hint">Include any access notes, safety considerations, or preferred timings.</p>
                )}
              </div>

              <div className="registration-field registration-field--upload">
                <label htmlFor="issuePhoto">Optional photo</label>
                <input id="issuePhoto" name="issuePhoto" type="file" accept="image/*" onChange={handlePhotoChange} />
                {errors.issuePhoto ? <p className="registration-hint registration-hint--error">{errors.issuePhoto}</p> : null}
                {issuePreview ? (
                  <div className="registration-upload__preview">
                    <img src={issuePreview} alt="Issue preview" />
                  </div>
                ) : null}
                {uploading ? (
                  <div className="registration-progress">
                    <span className="registration-progress__bar" style={{ width: `${uploadProgress}%` }} />
                    <span>Uploading…</span>
                  </div>
                ) : null}
                {!uploading && uploadProgress === 100 ? (
                  <div className="registration-progress">
                    <span className="registration-progress__bar" style={{ width: '100%' }} />
                    <span>Uploaded</span>
                  </div>
                ) : null}
              </div>
            </fieldset>

            <div className="registration-actions">
              <button type="submit" className="registration-submit" disabled={submitting}>
                {submitting ? 'Sending request…' : 'Submit booking request'}
              </button>
              <p className="registration-helpline">
                Need a hand? Email <a href="mailto:support@fixeasy.irish">support@fixeasy.irish</a>
              </p>
            </div>
          </form>

          <aside className="registration-aside">
            <section className="registration-aside__card">
              <span className="registration-aside__badge">What happens next?</span>
              <h2 className="registration-aside__title">Concierge follow-up</h2>
              <ul className="registration-aside__list">
                <li>We confirm your booking window and share your professional’s profile.</li>
                <li>Track progress and message the team through your FixEasy dashboard.</li>
                <li>Receive secure payment links and VAT-ready invoices once complete.</li>
              </ul>
            </section>
            <section className="registration-review">
              <strong>“Everything was handled from start to finish.”</strong>
              <span>
                “FixEasy confirmed our plumber within minutes, shared arrival updates, and the job was spotless. Couldn’t recommend
                the team enough.”
              </span>
              <span>— Aoife, Dublin 8</span>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
