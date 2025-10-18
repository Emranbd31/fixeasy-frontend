import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { SERVICE_OPTIONS } from '../../data/services'
import { isValidIrishPhone, sanitizePhone, sanitizeText } from '../../lib/validation'

const OTHER_CATEGORY_OPTION = 'Other (please specify)'
const categoryOptions = SERVICE_OPTIONS

const serviceAreaOptions = [
  'Dublin City & County',
  'Leinster',
  'Munster',
  'Connacht',
  'Ulster (ROI)',
  'Nationwide (Republic of Ireland)'
]

const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png']
const uploadFields = ['photoId', 'selfie', 'insurance']
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_PRO_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRO_BUCKET || 'professional-documents'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  serviceCategories: [],
  serviceAreas: [],
  otherCategoryDetail: '',
  consent: false
}

const initialUploads = {
  photoId: 0,
  selfie: 0,
  insurance: 0
}

const initialUploadedDocuments = {
  photoId: null,
  selfie: null,
  insurance: null
}

const stepLabels = ['Info', 'Verification', 'Confirmation']

const fileLabels = {
  photoId: 'Photo ID (passport or driving licence)',
  selfie: 'Selfie for verification',
  insurance: 'Insurance certificate (optional)'
}

const optionalFields = new Set(['insurance'])

export default function ProfessionalRegistration() {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadProgress, setUploadProgress] = useState({ ...initialUploads })
  const [uploadedDocuments, setUploadedDocuments] = useState({ ...initialUploadedDocuments })
  const [previews, setPreviews] = useState({ photoId: null, selfie: null, insurance: null })
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [previews])

  const otherCategorySelected = useMemo(
    () => formData.serviceCategories.includes(OTHER_CATEGORY_OPTION),
    [formData.serviceCategories]
  )

  useEffect(() => {
    if (!otherCategorySelected && formData.otherCategoryDetail) {
      setFormData((prev) => ({ ...prev, otherCategoryDetail: '' }))
    }
  }, [otherCategorySelected, formData.otherCategoryDetail])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const toggleSelection = (key, value) => {
    setFormData((prev) => {
      const exists = prev[key].includes(value)
      const updated = exists ? prev[key].filter((item) => item !== value) : [...prev[key], value]
      return { ...prev, [key]: updated }
    })
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleConsentChange = (event) => {
    const { checked } = event.target
    setFormData((prev) => ({ ...prev, consent: checked }))
    setErrors((prev) => ({ ...prev, consent: undefined }))
  }

  const resetPreview = (field) => {
    setPreviews((prev) => {
      if (prev[field]) {
        URL.revokeObjectURL(prev[field])
      }
      return { ...prev, [field]: null }
    })
  }

  const uploadDocument = async (field, file) => {
    setUploadProgress((prev) => ({ ...prev, [field]: 5 }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))

    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase Storage is not configured for professional uploads.')
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')
      const path = `verification/${Date.now()}-${safeName}`

      const body = new FormData()
      body.append('file', file)
      body.append('path', path)

      const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_PRO_BUCKET}`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'x-upsert': 'true',
          'x-metadata': JSON.stringify({
            document_type: field,
            professional: sanitizeText(formData.fullName) || 'unknown',
            submitted_at: new Date().toISOString()
          })
        },
        body
      })

      if (!response.ok) {
        let message = 'Upload failed. Please try again shortly.'
        try {
          const errorPayload = await response.json()
          if (errorPayload?.message) {
            message = errorPayload.message
          }
        } catch (err) {
          // ignore parse errors
        }
        throw new Error(message)
      }

      setUploadProgress((prev) => ({ ...prev, [field]: 100 }))
      setUploadedDocuments((prev) => ({
        ...prev,
        [field]: {
          path,
          url: `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_PRO_BUCKET}/${path}`,
          name: file.name,
          size: file.size,
          type: file.type
        }
      }))
    } catch (error) {
      console.error('Upload error', error)
      setErrors((prev) => ({
        ...prev,
        [field]: 'Upload failed. Please try again or contact support if it continues.'
      }))
      setUploadProgress((prev) => ({ ...prev, [field]: 0 }))
      setUploadedDocuments((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleFileChange = (field) => async (event) => {
    const file = event.target.files?.[0]

    resetPreview(field)
    setUploadedDocuments((prev) => ({ ...prev, [field]: null }))
    setUploadProgress((prev) => ({ ...prev, [field]: 0 }))

    if (!file) {
      if (!optionalFields.has(field)) {
        setErrors((prev) => ({ ...prev, [field]: `Please upload your ${fileLabels[field].toLowerCase()}.` }))
      }
      return
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    const isValidType = extension ? allowedExtensions.includes(extension) : false
    const isUnderSizeLimit = file.size <= 5 * 1024 * 1024

    if (!isValidType) {
      setErrors((prev) => ({ ...prev, [field]: 'Unsupported file type. Upload a PDF, JPG, or PNG.' }))
      return
    }

    if (!isUnderSizeLimit) {
      setErrors((prev) => ({ ...prev, [field]: 'Files must be 5MB or smaller.' }))
      return
    }

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviews((prev) => ({ ...prev, [field]: url }))
    }

    await uploadDocument(field, file)
  }

  const runStepValidation = (step) => {
    const validation = {}

    if (step === 1) {
      if (!sanitizeText(formData.fullName)) {
        validation.fullName = 'Enter your full name or business name.'
      }

      if (!sanitizeText(formData.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        validation.email = 'Add a valid email address.'
      }

      if (!isValidIrishPhone(formData.phone)) {
        validation.phone = 'Use an Irish phone number in +353 format.'
      }

      if (formData.serviceCategories.length === 0) {
        validation.serviceCategories = 'Select at least one service category.'
      }

      if (formData.serviceCategories.includes(OTHER_CATEGORY_OPTION) && !sanitizeText(formData.otherCategoryDetail)) {
        validation.otherCategoryDetail = 'Describe the additional service you offer.'
      }

      if (formData.serviceAreas.length === 0) {
        validation.serviceAreas = 'Select at least one service area.'
      }
    }

    if (step === 2) {
      if (!uploadedDocuments.photoId) {
        validation.photoId = 'Upload your passport or driving licence.'
      }

      if (!uploadedDocuments.selfie) {
        validation.selfie = 'Upload a selfie so we can match your ID.'
      }
    }

    if (step === 3) {
      if (!formData.consent) {
        validation.consent = 'Confirm the documents are authentic before submitting.'
      }
    }

    return validation
  }

  const handleNext = () => {
    const validation = runStepValidation(currentStep)
    if (Object.keys(validation).length) {
      setErrors(validation)
      return
    }

    setErrors({})
    setCurrentStep((step) => Math.min(step + 1, stepLabels.length))
  }

  const handleBack = () => {
    setErrors({})
    setCurrentStep((step) => Math.max(step - 1, 1))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmissionError('')

    const validation = {
      ...runStepValidation(1),
      ...runStepValidation(2),
      ...runStepValidation(3)
    }

    if (Object.keys(validation).length) {
      setErrors(validation)
      let targetStep = 1
      if (validation.photoId || validation.selfie) {
        targetStep = 2
      } else if (validation.consent) {
        targetStep = 3
      }
      setCurrentStep(targetStep)
      return
    }

    setErrors({})
    setSubmitting(true)

    const payload = {
      fullName: sanitizeText(formData.fullName),
      email: sanitizeText(formData.email),
      phone: sanitizePhone(formData.phone),
      serviceCategories: formData.serviceCategories,
      otherCategoryDetail: sanitizeText(formData.otherCategoryDetail),
      serviceAreas: formData.serviceAreas,
      consent: formData.consent,
      verificationDocuments: {
        photo_id_url: uploadedDocuments.photoId?.path ?? '',
        selfie_url: uploadedDocuments.selfie?.path ?? '',
        insurance_url: uploadedDocuments.insurance?.path ?? ''
      }
    }

    try {
      const response = await fetch('/api/register/pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result?.error ?? 'Submission failed')
      }

      setFormData(initialState)
      setUploadedDocuments({ ...initialUploadedDocuments })
      setUploadProgress({ ...initialUploads })
      setPreviews({ photoId: null, selfie: null, insurance: null })
      setCurrentStep(3)
      setSubmissionSuccess(true)
    } catch (error) {
      console.error('Submission error', error)
      setSubmissionError(error.message || 'We could not submit your application. Try again shortly.')
    } finally {
      setSubmitting(false)
    }
  }

  const serviceCategorySummary = useMemo(() => {
    if (formData.serviceCategories.length === 0) {
      return 'No service categories selected yet.'
    }

    const selections = [...formData.serviceCategories]
    if (otherCategorySelected && formData.otherCategoryDetail) {
      const index = selections.indexOf(OTHER_CATEGORY_OPTION)
      selections.splice(index, 1, `${OTHER_CATEGORY_OPTION} — ${formData.otherCategoryDetail}`)
    }
    return selections.join(', ')
  }, [formData.serviceCategories, otherCategorySelected, formData.otherCategoryDetail])

  const serviceAreaSummary = useMemo(() => {
    if (formData.serviceAreas.length === 0) {
      return 'No service areas selected yet.'
    }
    return formData.serviceAreas.join(', ')
  }, [formData.serviceAreas])

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="registration-step">
          <fieldset className="registration-fieldset">
            <legend>Professional details</legend>
            <div className="registration-field">
              <label htmlFor="fullName">Full name / Business name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                autoComplete="organization"
                aria-invalid={Boolean(errors.fullName)}
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
                  onChange={handleInputChange}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
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
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone ? <p className="registration-hint registration-hint--error">{errors.phone}</p> : null}
              </div>
            </div>
          </fieldset>

          <fieldset className="registration-fieldset">
            <legend>Services</legend>
            <div className="registration-field registration-field--group">
              <span>Select your service categories</span>
              <div className="registration-chip-group" role="group" aria-label="Service categories">
                {categoryOptions.map((category) => {
                  const isActive = formData.serviceCategories.includes(category)
                  return (
                    <button
                      type="button"
                      key={category}
                      className={`registration-chip ${isActive ? 'is-active' : ''}`}
                      onClick={() => toggleSelection('serviceCategories', category)}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
              {errors.serviceCategories ? (
                <p className="registration-hint registration-hint--error">{errors.serviceCategories}</p>
              ) : null}
            </div>

            {otherCategorySelected ? (
              <div className="registration-field">
                <label htmlFor="otherCategoryDetail">Describe other services</label>
                <input
                  id="otherCategoryDetail"
                  name="otherCategoryDetail"
                  type="text"
                  value={formData.otherCategoryDetail}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.otherCategoryDetail)}
                  placeholder="e.g. Heritage conservation specialist"
                />
                {errors.otherCategoryDetail ? (
                  <p className="registration-hint registration-hint--error">{errors.otherCategoryDetail}</p>
                ) : (
                  <p className="registration-hint">Add a short line about the bespoke work you offer.</p>
                )}
              </div>
            ) : null}

            <div className="registration-field registration-field--group">
              <span>Service areas</span>
              <div className="registration-chip-group" role="group" aria-label="Service areas">
                {serviceAreaOptions.map((area) => {
                  const isActive = formData.serviceAreas.includes(area)
                  return (
                    <button
                      type="button"
                      key={area}
                      className={`registration-chip ${isActive ? 'is-active' : ''}`}
                      onClick={() => toggleSelection('serviceAreas', area)}
                    >
                      {area}
                    </button>
                  )
                })}
              </div>
              {errors.serviceAreas ? (
                <p className="registration-hint registration-hint--error">{errors.serviceAreas}</p>
              ) : null}
            </div>
          </fieldset>
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="registration-step">
          <fieldset className="registration-fieldset">
            <legend>Upload your verification documents</legend>
            {uploadFields.map((field) => (
              <div key={field} className="registration-field registration-field--upload">
                <label htmlFor={field}>{fileLabels[field]}</label>
                <input
                  id={field}
                  name={field}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleFileChange(field)}
                  aria-invalid={Boolean(errors[field])}
                />
                {uploadProgress[field] > 0 ? (
                  <progress value={uploadProgress[field]} max="100">
                    {uploadProgress[field]}%
                  </progress>
                ) : null}
                {previews[field] ? (
                  <div className="registration-upload__preview">
                    <img src={previews[field] ?? ''} alt="Uploaded preview" />
                  </div>
                ) : null}
                {uploadedDocuments[field]?.name ? (
                  <p className="registration-hint">
                    Uploaded: <strong>{uploadedDocuments[field]?.name}</strong>
                  </p>
                ) : null}
                {errors[field] ? (
                  <p className="registration-hint registration-hint--error">{errors[field]}</p>
                ) : null}
              </div>
            ))}
          </fieldset>
        </div>
      )
    }

    return (
      <div className="registration-step">
        <fieldset className="registration-fieldset">
          <legend>Review &amp; confirm</legend>
          <dl className="registration-review">
            <div>
              <dt>Professional</dt>
              <dd>{formData.fullName || '—'}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>
                {formData.email || '—'}
                <br />
                {formData.phone || '—'}
              </dd>
            </div>
            <div>
              <dt>Service categories</dt>
              <dd>{serviceCategorySummary}</dd>
            </div>
            <div>
              <dt>Service areas</dt>
              <dd>{serviceAreaSummary}</dd>
            </div>
            <div>
              <dt>Documents</dt>
              <dd>
                <ul>
                  {uploadFields.map((field) => (
                    <li key={field}>
                      {fileLabels[field]} —{' '}
                      {uploadedDocuments[field]?.name ? (
                        <a href={uploadedDocuments[field]?.url} target="_blank" rel="noopener noreferrer">
                          {uploadedDocuments[field]?.name}
                        </a>
                      ) : (
                        optionalFields.has(field) ? 'Optional (not supplied)' : 'Missing'
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <label className="registration-consent">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleConsentChange}
              aria-invalid={Boolean(errors.consent)}
            />
            <span>I confirm the details and documents supplied are accurate.</span>
          </label>
          {errors.consent ? <p className="registration-hint registration-hint--error">{errors.consent}</p> : null}

          {submissionSuccess ? (
            <div className="registration-success" role="status">
              <p>Your verification is under review — we’ll contact you soon.</p>
            </div>
          ) : null}
        </fieldset>
      </div>
    )
  }

  return (
    <div className="registration-layout">
      <Head>
        <title>Join FixEasy as a Professional</title>
        <meta
          name="description"
          content="Apply to join FixEasy as a verified professional. Upload your ID, selfie, and insurance to complete verification."
        />
      </Head>

      <div className="registration-layout__container">
        <header className="registration-header">
          <span className="registration-header__eyebrow">Join as a professional</span>
          <h1 className="registration-header__title">Become part of Ireland’s trusted FixEasy network</h1>
          <p className="registration-header__intro">
            Follow the guided steps to submit your services, service areas, and verification documents. Our team will review
            everything quickly and activate your dashboard.
          </p>
        </header>

        <div className="registration-grid">
          <section className="registration-card registration-card--pro" aria-labelledby="pro-register-heading">
            <div className="registration-card__intro">
              <h2 id="pro-register-heading" className="registration-card__title">
                Professional onboarding
              </h2>
              <p className="registration-note">Secure uploads with Supabase Storage. Three quick steps and you’re ready.</p>
            </div>

            <ol className="registration-steps" role="list">
              {stepLabels.map((label, index) => {
                const stepNumber = index + 1
                const state = stepNumber === currentStep ? 'current' : stepNumber < currentStep ? 'complete' : 'upcoming'
                return (
                  <li key={label} className={`registration-steps__item registration-steps__item--${state}`}>
                    <span className="registration-steps__number">{stepNumber}</span>
                    <span>{label}</span>
                  </li>
                )
              })}
            </ol>

            {submissionError ? (
              <div className="registration-errors" role="alert">
                {submissionError}
              </div>
            ) : null}

            <form className="registration-form" onSubmit={handleSubmit} noValidate>
              {renderStep()}

              <div className="registration-step-actions">
                <div className="registration-step-actions__left">
                  {currentStep > 1 ? (
                    <button type="button" className="registration-secondary" onClick={handleBack}>
                      Back
                    </button>
                  ) : null}
                </div>

                <div className="registration-step-actions__right">
                  {currentStep < stepLabels.length ? (
                    <button type="button" className="registration-secondary" onClick={handleNext}>
                      Continue
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    className="registration-submit"
                    disabled={submitting || submissionSuccess}
                    aria-busy={submitting}
                  >
                    {submitting ? 'Submitting…' : submissionSuccess ? 'Submitted' : 'Submit for review'}
                  </button>
                </div>
              </div>
            </form>
          </section>

          <aside className="registration-aside" aria-label="FixEasy partner benefits">
            <div className="registration-aside__card">
              <h2 className="registration-aside__title">Why professionals choose FixEasy</h2>
              <ul className="registration-aside__list">
                <li>Guaranteed payments with transparent pricing.</li>
                <li>Priority access to vetted residential and commercial leads.</li>
                <li>Dedicated Irish support for scheduling and compliance.</li>
              </ul>
            </div>

            <div className="registration-aside__card registration-helpline">
              <strong>Need onboarding help?</strong>
              <span>
                Email <a href="mailto:partners@fixeasy.irish">partners@fixeasy.irish</a> or call{' '}
                <a href="tel:+35319638020">+353 1 963 8020</a>.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
