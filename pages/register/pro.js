import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isValidIrishPhone, sanitizePhone, sanitizeText } from '../../lib/validation'

const STORAGE_KEY = 'fixeasy-pro-register-draft-2025'

const stepLabels = ['Info', 'Verification', 'Confirm']

const OTHER_CATEGORY_OPTION = 'Other (please specify)'

const categoryOptions = [
  'Plumbing & Heating',
  'Electrical & EV',
  'Cleaning & Facilities',
  'Carpentry & Fit-out',
  'Landscaping & Outdoors',
  'Painting & Finishing',
  'Appliance Repair',
  'Handyman & Maintenance',
  OTHER_CATEGORY_OPTION
]

const serviceAreaOptions = [
  'Dublin City & County',
  'Leinster',
  'Munster',
  'Connacht',
  'Ulster (ROI)',
  'Nationwide (Republic of Ireland)'
]

const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png']

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  serviceCategories: [],
  serviceAreas: [],
  experienceYears: '',
  languages: '',
  otherCategoryDetail: '',
  verificationNotes: '',
  passport: null,
  licence: null,
  address: null,
  consent: false
}

const fileLabels = {
  passport: 'Passport or National ID',
  licence: 'Driving Licence',
  address: 'Address Proof'
}

export default function ProfessionalRegistration() {
  const router = useRouter()
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadProgress, setUploadProgress] = useState({ passport: 0, licence: 0, address: 0 })
  const [uploadedDocuments, setUploadedDocuments] = useState({ passport: null, licence: null, address: null })
  const [previews, setPreviews] = useState({ passport: null, licence: null, address: null })
  const [savingDraft, setSavingDraft] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setFormData((prev) => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.warn('Failed to restore draft', error)
    }
  }, [])

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
  }, [formData.otherCategoryDetail, formData.serviceCategories, otherCategorySelected])

  const serviceAreaSummary = useMemo(() => {
    if (formData.serviceAreas.length === 0) {
      return 'No service areas selected yet.'
    }
    return formData.serviceAreas.join(', ')
  }, [formData.serviceAreas])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  useEffect(() => {
    if (!otherCategorySelected && formData.otherCategoryDetail) {
      setFormData((prev) => ({ ...prev, otherCategoryDetail: '' }))
    }
  }, [formData.otherCategoryDetail, otherCategorySelected])

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
      const signResponse = await fetch('/api/storage/sign-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bucket: 'professional-documents',
          fileName: file.name,
          contentType: file.type
        })
      })

      const signed = await signResponse.json().catch(() => ({}))

      if (!signResponse.ok || !signed?.url) {
        throw new Error(signed?.error ?? 'Unable to create upload URL')
      }

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', signed.url)
        if (signed?.headers) {
          Object.entries(signed.headers).forEach(([header, headerValue]) => {
            xhr.setRequestHeader(header, headerValue)
          })
        } else if (file.type) {
          xhr.setRequestHeader('Content-Type', file.type)
        }

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return
          const percentage = Math.round((event.loaded / event.total) * 100)
          setUploadProgress((prev) => ({ ...prev, [field]: percentage }))
        }

        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        }

        xhr.send(file)
      })

      setUploadProgress((prev) => ({ ...prev, [field]: 100 }))
      setUploadedDocuments((prev) => ({
        ...prev,
        [field]: {
          path: signed.path ?? signed.objectName ?? signed.key ?? '',
          url: signed.publicUrl ?? signed.previewUrl ?? signed.url.split('?')[0],
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
    setFormData((prev) => ({ ...prev, [field]: file ?? null }))
    setUploadedDocuments((prev) => ({ ...prev, [field]: null }))
    setUploadProgress((prev) => ({ ...prev, [field]: 0 }))

    if (!file) {
      return
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    const isValidType = allowedExtensions.includes(extension)
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
      if (!sanitizeText(formData.experienceYears) || Number(formData.experienceYears) < 0) {
        validation.experienceYears = 'Enter your years of professional experience.'
      }

      if (!formData.passport || !uploadedDocuments.passport) {
        validation.passport = 'Upload your passport or national ID.'
      }

      if (!formData.licence || !uploadedDocuments.licence) {
        validation.licence = 'Upload your driving licence.'
      }

      if (!formData.address || !uploadedDocuments.address) {
        validation.address = 'Upload proof of address.'
      }

      if (formData.verificationNotes && sanitizeText(formData.verificationNotes).length > 800) {
        validation.verificationNotes = 'Keep verification notes under 800 characters.'
      }

      if (!formData.consent) {
        validation.consent = 'You must confirm the documents are authentic.'
      }
    }

    if (step === 3) {
      if (!formData.consent) {
        validation.consent = 'Confirm the authenticity of your documents before submitting.'
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

  const handleSaveDraft = () => {
    if (typeof window === 'undefined') {
      return
    }

    setSavingDraft(true)
    setDraftSaved(false)

    const draft = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      serviceCategories: formData.serviceCategories,
      otherCategoryDetail: formData.otherCategoryDetail,
      serviceAreas: formData.serviceAreas,
      experienceYears: formData.experienceYears,
      languages: formData.languages
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
      setDraftSaved(true)
    } catch (error) {
      console.warn('Unable to save draft', error)
      setSubmissionError('We could not save the draft locally. Check storage permissions and try again.')
    } finally {
      setSavingDraft(false)
    }
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
      if (currentStep !== 3) {
        setCurrentStep(1)
      } else if (validation.passport || validation.licence || validation.address) {
        setCurrentStep(2)
      }
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
      yearsExperience: Number(formData.experienceYears),
      languages: sanitizeText(formData.languages),
      verificationNotes: sanitizeText(formData.verificationNotes),
      status: 'pending_verification',
      verificationDocuments: {
        passport_url: uploadedDocuments.passport?.path ?? '',
        licence_url: uploadedDocuments.licence?.path ?? '',
        address_url: uploadedDocuments.address?.path ?? ''
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

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY)
      }

      setFormData(initialState)
      setUploadedDocuments({ passport: null, licence: null, address: null })
      setUploadProgress({ passport: 0, licence: 0, address: 0 })
      setPreviews({ passport: null, licence: null, address: null })
      setCurrentStep(1)

      router.push({ pathname: '/dashboard/pro', query: { status: 'pending_verification' } })
    } catch (error) {
      console.error('Submission error', error)
      setSubmissionError(error.message || 'We could not submit your application. Try again shortly.')
    } finally {
      setSubmitting(false)
    }
  }

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
                <label htmlFor="otherCategoryDetail">Describe the additional service</label>
                <input
                  id="otherCategoryDetail"
                  name="otherCategoryDetail"
                  type="text"
                  value={formData.otherCategoryDetail}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.otherCategoryDetail)}
                  placeholder="e.g. Heritage masonry conservation"
                />
                {errors.otherCategoryDetail ? (
                  <p className="registration-hint registration-hint--error">{errors.otherCategoryDetail}</p>
                ) : (
                  <p className="registration-hint">Helps us route your onboarding to the correct specialist team.</p>
                )}
              </div>
            ) : null}

            <div className="registration-field registration-field--group">
              <span>Select your service areas</span>
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

            <div className="registration-field">
              <label htmlFor="languages">Languages spoken (optional)</label>
              <input
                id="languages"
                name="languages"
                type="text"
                placeholder="English, Gaeilge, Polish"
                value={formData.languages}
                onChange={handleInputChange}
              />
            </div>
          </fieldset>
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="registration-step">
          <fieldset className="registration-fieldset">
            <legend>Verification documents</legend>
            <div className="registration-field">
              <label htmlFor="experienceYears">Years of experience</label>
              <input
                id="experienceYears"
                name="experienceYears"
                type="number"
                min="0"
                value={formData.experienceYears}
                onChange={handleInputChange}
                aria-invalid={Boolean(errors.experienceYears)}
              />
              {errors.experienceYears ? (
                <p className="registration-hint registration-hint--error">{errors.experienceYears}</p>
              ) : null}
            </div>

            {['passport', 'licence', 'address'].map((field) => (
              <div key={field} className="registration-field registration-upload">
                <label htmlFor={`${field}-upload`}>{fileLabels[field]}</label>
                <input
                  id={`${field}-upload`}
                  name={field}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange(field)}
                  aria-invalid={Boolean(errors[field])}
                />
                <p className="registration-hint">PDF, JPG, or PNG up to 5MB.</p>
                {previews[field] ? (
                  <div className="registration-upload__preview">
                    <img src={previews[field]} alt={`${fileLabels[field]} preview`} />
                  </div>
                ) : null}
                {uploadProgress[field] > 0 ? (
                  <div className="registration-progress" role="status" aria-live="polite">
                    <div className="registration-progress__bar" style={{ width: `${uploadProgress[field]}%` }} />
                    <span>{uploadProgress[field]}%</span>
                  </div>
                ) : null}
                {uploadedDocuments[field]?.url ? (
                  <p className="registration-hint">
                    Uploaded as{' '}
                    <a href={uploadedDocuments[field].url} target="_blank" rel="noopener noreferrer">
                      {uploadedDocuments[field].name}
                    </a>
                  </p>
                ) : null}
                {errors[field] ? <p className="registration-hint registration-hint--error">{errors[field]}</p> : null}
              </div>
            ))}
          </fieldset>

          <div className="registration-field">
            <label htmlFor="verificationNotes">Verification notes (optional)</label>
            <textarea
              id="verificationNotes"
              name="verificationNotes"
              rows={4}
              value={formData.verificationNotes}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.verificationNotes)}
              placeholder="Share anything the compliance team should review during onboarding."
            />
            {errors.verificationNotes ? (
              <p className="registration-hint registration-hint--error">{errors.verificationNotes}</p>
            ) : (
              <p className="registration-hint">Examples: specialist licences, client references, or context for your documents.</p>
            )}
          </div>

          <div className="registration-consent">
            <label htmlFor="consent" className="registration-consent__label">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={formData.consent}
                onChange={handleConsentChange}
                aria-invalid={Boolean(errors.consent)}
              />
              I confirm these documents are authentic.
            </label>
            {errors.consent ? <p className="registration-hint registration-hint--error">{errors.consent}</p> : null}
          </div>
        </div>
      )
    }

    return (
      <div className="registration-step">
        <fieldset className="registration-fieldset">
          <legend>Review and confirm</legend>
          <dl className="registration-summary">
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
              <dt>Experience</dt>
              <dd>{formData.experienceYears ? `${formData.experienceYears} years` : '—'}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>{formData.languages ? formData.languages : '—'}</dd>
            </div>
            <div>
              <dt>Documents</dt>
              <dd>
                <ul>
                  {['passport', 'licence', 'address'].map((field) => (
                    <li key={field}>
                      {fileLabels[field]} —{' '}
                      {uploadedDocuments[field]?.name ? (
                        <a href={uploadedDocuments[field]?.url} target="_blank" rel="noopener noreferrer">
                          {uploadedDocuments[field]?.name}
                        </a>
                      ) : (
                        'Not uploaded'
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </fieldset>

        <p className="registration-note">
          Submit to start verification. We will email updates and unlock dashboard access once your documents are approved.
        </p>
      </div>
    )
  }

  return (
    <div className="registration-layout">
      <Head>
        <title>FixEasy Professional Registration</title>
        <meta
          name="description"
          content="Apply to join FixEasy as a verified professional. Secure document upload, Irish compliance checks, and fast approval."
        />
      </Head>

      <div className="registration-layout__container">
        <header className="registration-header">
          <span className="registration-header__eyebrow">Professional onboarding</span>
          <h1 className="registration-header__title">Step into the FixEasy verified network</h1>
          <p className="registration-header__intro">
            Complete the guided steps below to upload your credentials and submit for verification.
          </p>
        </header>

        <div className="registration-grid">
          <section className="registration-card registration-card--pro" aria-labelledby="pro-register-heading">
            <div className="registration-card__intro">
              <h2 id="pro-register-heading" className="registration-card__title">
                Professional verification
              </h2>
              <p className="registration-note">
                Secure uploads with Supabase Storage. You can save progress locally and return anytime.
              </p>
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

            {draftSaved ? (
              <p className="registration-success" role="status">
                Draft saved locally. Return later to continue onboarding.
              </p>
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
                  <button
                    type="button"
                    className="registration-secondary"
                    onClick={handleSaveDraft}
                    disabled={savingDraft}
                  >
                    {savingDraft ? 'Saving…' : 'Save draft'}
                  </button>
                  {currentStep < stepLabels.length ? (
                    <button type="button" className="registration-primary" onClick={handleNext}>
                      Continue
                    </button>
                  ) : (
                    <button type="submit" className="registration-submit" disabled={submitting} aria-busy={submitting}>
                      {submitting ? 'Submitting…' : 'Submit for Verification'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </section>

          <aside className="registration-aside" aria-label="Verification guidance">
            <div className="registration-aside__card">
              <h2 className="registration-aside__title">What happens next?</h2>
              <ul className="registration-aside__list">
                <li>Documents reviewed within one business day.</li>
                <li>Status updates sent to your email address.</li>
                <li>Dashboard unlocks when verification is approved.</li>
              </ul>
            </div>

            <div className="registration-aside__card">
              <h2 className="registration-aside__title">Need help?</h2>
              <p>Reach the FixEasy compliance team:</p>
              <ul className="registration-aside__list">
                <li>
                  Email <a href="mailto:onboarding@fixeasy.irish">onboarding@fixeasy.irish</a>
                </li>
                <li>
                  Call <a href="tel:+35319638020">+353 1 963 8020</a>
                </li>
              </ul>
            </div>

            <div className="registration-aside__card">
              <h2 className="registration-aside__title">Security reminders</h2>
              <ul className="registration-aside__list">
                <li>Uploads are encrypted and scoped to FixEasy admins.</li>
                <li>Only you and compliance reviewers can access documents.</li>
                <li>Audit trails are generated for every verification decision.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
