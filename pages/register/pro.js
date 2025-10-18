import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { SERVICE_OPTIONS } from '../../data/services'
import { isValidIrishPhone, sanitizePhone, sanitizeText } from '../../lib/validation'

const OTHER_CATEGORY_OPTION = 'Other (please specify)'
const OTHER_SERVICE_AREA_OPTION = 'Other area (please specify)'
const categoryOptions = SERVICE_OPTIONS

const serviceAreaOptions = [
  'Carlow',
  'Cavan',
  'Clare',
  'Cork',
  'Donegal',
  'Dublin City & County',
  'Galway',
  'Kerry',
  'Kildare',
  'Kilkenny',
  'Laois',
  'Leitrim',
  'Limerick',
  'Longford',
  'Louth',
  'Mayo',
  'Meath',
  'Monaghan',
  'Offaly',
  'Roscommon',
  'Sligo',
  'Tipperary',
  'Waterford',
  'Westmeath',
  'Wexford',
  'Wicklow',
  'Nationwide (Republic of Ireland)',
  'Northern Ireland (on request)',
  OTHER_SERVICE_AREA_OPTION
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
  otherServiceAreaDetail: '',
  consent: false
}

const initialUploads = { photoId: 0, selfie: 0, insurance: 0 }
const initialUploadedDocuments = { photoId: null, selfie: null, insurance: null }
const initialDragStates = { photoId: false, selfie: false, insurance: false }

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
  const [dragStates, setDragStates] = useState({ ...initialDragStates })
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  // Clean up image previews
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [previews])

  const otherCategorySelected = useMemo(
    () => formData.serviceCategories.includes(OTHER_CATEGORY_OPTION),
    [formData.serviceCategories]
  )

  const otherAreaSelected = useMemo(
    () => formData.serviceAreas.includes(OTHER_SERVICE_AREA_OPTION),
    [formData.serviceAreas]
  )

  // Reset "Other service" when deselected
  useEffect(() => {
    if (!otherCategorySelected && formData.otherCategoryDetail) {
      setFormData((prev) => ({ ...prev, otherCategoryDetail: '' }))
    }
  }, [formData.otherCategoryDetail, otherCategorySelected])

  useEffect(() => {
    if (!otherAreaSelected && formData.otherServiceAreaDetail) {
      setFormData((prev) => ({ ...prev, otherServiceAreaDetail: '' }))
    }
  }, [formData.otherServiceAreaDetail, otherAreaSelected])

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
      if (prev[field]) URL.revokeObjectURL(prev[field])
      return { ...prev, [field]: null }
    })
  }

  const uploadDocument = async (field, file) => {
    setUploadProgress((prev) => ({ ...prev, [field]: 5 }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))

    let progressInterval

    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase Storage is not configured.')
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')
      const path = `verification/${Date.now()}-${safeName}`

      const body = new FormData()
      body.append('file', file)
      body.append('path', path)

      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[field]
          if (current >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return { ...prev, [field]: Math.min(current + 8, 90) }
        })
      }, 350)

      const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_PRO_BUCKET}`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'x-upsert': 'true'
        },
        body
      })

      if (!response.ok) throw new Error('Upload failed. Please try again.')

      setUploadProgress((prev) => ({ ...prev, [field]: 100 }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      setUploadedDocuments((prev) => ({
        ...prev,
        [field]: {
          path,
          url: `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_PRO_BUCKET}/${path}`,
          name: file.name
        }
      }))
    } catch (error) {
      console.error('Upload error:', error)
      setErrors((prev) => ({ ...prev, [field]: error.message }))
      setUploadProgress((prev) => ({ ...prev, [field]: 0 }))
    } finally {
      if (progressInterval) clearInterval(progressInterval)
    }
  }

  const handleFileSelection = async (field, file) => {
    resetPreview(field)
    setUploadedDocuments((prev) => ({ ...prev, [field]: null }))
    setUploadProgress((prev) => ({ ...prev, [field]: 0 }))

    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase()
    const validType = allowedExtensions.includes(extension)
    const validSize = file.size <= 5 * 1024 * 1024

    if (!validType) {
      setErrors((prev) => ({ ...prev, [field]: 'Upload a PDF, JPG, or PNG.' }))
      return
    }
    if (!validSize) {
      setErrors((prev) => ({ ...prev, [field]: 'Files must be 5MB or smaller.' }))
      return
    }

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviews((prev) => ({ ...prev, [field]: url }))
    }

    await uploadDocument(field, file)
  }

  const handleFileChange = (field) => async (event) => {
    const file = event.target.files?.[0]
    await handleFileSelection(field, file)
    if (event.target.value) event.target.value = ''
  }

  const handleDragEnter = (field) => (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDragStates((prev) => ({ ...prev, [field]: true }))
  }

  const handleDragLeave = (field) => (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.currentTarget === event.target) {
      setDragStates((prev) => ({ ...prev, [field]: false }))
    }
  }

  const handleDragOver = (field) => (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!dragStates[field]) {
      setDragStates((prev) => ({ ...prev, [field]: true }))
    }
  }

  const handleDrop = (field) => async (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDragStates((prev) => ({ ...prev, [field]: false }))
    const file = event.dataTransfer?.files?.[0]
    if (file) {
      await handleFileSelection(field, file)
    }
  }

  const runStepValidation = (step) => {
    const validation = {}

    if (step === 1) {
      if (!sanitizeText(formData.fullName)) validation.fullName = 'Enter your full name or business name.'
      if (!sanitizeText(formData.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        validation.email = 'Add a valid email.'
      if (!isValidIrishPhone(formData.phone)) validation.phone = 'Use an Irish phone number in +353 format.'
      if (formData.serviceCategories.length === 0)
        validation.serviceCategories = 'Select at least one service category.'
      if (otherCategorySelected && !sanitizeText(formData.otherCategoryDetail))
        validation.otherCategoryDetail = 'Describe the additional service.'
      if (formData.serviceAreas.length === 0) validation.serviceAreas = 'Select at least one service area.'
      if (otherAreaSelected && !sanitizeText(formData.otherServiceAreaDetail))
        validation.otherServiceAreaDetail = 'Share the locations you cover.'
    }

    if (step === 2) {
      if (!uploadedDocuments.photoId) validation.photoId = 'Upload your ID.'
      if (!uploadedDocuments.selfie) validation.selfie = 'Upload a selfie for verification.'
    }

    if (step === 3 && !formData.consent)
      validation.consent = 'Confirm the authenticity of your documents.'

    return validation
  }

  const handleNext = () => {
    const validation = runStepValidation(currentStep)
    if (Object.keys(validation).length) return setErrors(validation)
    setErrors({})
    setCurrentStep((s) => Math.min(s + 1, stepLabels.length))
  }

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmissionError('')
    const validation = { ...runStepValidation(1), ...runStepValidation(2), ...runStepValidation(3) }
    if (Object.keys(validation).length) return setErrors(validation)

    setSubmitting(true)
    const payload = {
      fullName: sanitizeText(formData.fullName),
      email: sanitizeText(formData.email),
      phone: sanitizePhone(formData.phone),
      serviceCategories: formData.serviceCategories,
      otherCategoryDetail: sanitizeText(formData.otherCategoryDetail),
      serviceAreas: formData.serviceAreas,
      otherServiceAreaDetail: sanitizeText(formData.otherServiceAreaDetail),
      consent: formData.consent,
      verificationDocuments: {
        photo_id_url: uploadedDocuments.photoId?.path ?? '',
        selfie_url: uploadedDocuments.selfie?.path ?? '',
        insurance_url: uploadedDocuments.insurance?.path ?? ''
      }
    }

    try {
      const res = await fetch('/api/register/pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Submission failed.')
      setSubmissionSuccess(true)
      setFormData(initialState)
      setUploadedDocuments(initialUploadedDocuments)
      setUploadProgress(initialUploads)
      setPreviews({ photoId: null, selfie: null, insurance: null })
      setCurrentStep(3)
    } catch (err) {
      console.error(err)
      setSubmissionError('Could not submit your registration. Try again shortly.')
    } finally {
      setSubmitting(false)
    }
  }

  // --- UI RENDER ---
  return (
    <div className="registration-layout">
      <Head>
        <title>Join FixEasy as a Professional</title>
        <meta name="description" content="Apply to join FixEasy as a verified professional." />
      </Head>

      <div className="registration-layout__container">
        <header className="registration-header">
          <span className="registration-header__eyebrow">Join as a professional</span>
          <h1 className="registration-header__title">Become part of Ireland’s trusted FixEasy network</h1>
        </header>

        <form className="registration-form" onSubmit={handleSubmit}>
          {/* STEP 1: Info */}
          {currentStep === 1 && (
            <>
              <div className="registration-field">
                <label>Full Name / Business Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleInputChange} />
              </div>

              <div className="registration-field">
                <label>Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} />
              </div>

              <div className="registration-field">
                <label>Phone</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>

              <div className="registration-field">
                <label>Service Categories</label>
                <div className="registration-chip-group">
                  {categoryOptions.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      className={`registration-chip ${formData.serviceCategories.includes(cat) ? 'is-active' : ''}`}
                      onClick={() => toggleSelection('serviceCategories', cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {otherCategorySelected && (
                <div className="registration-field">
                  <label>Other Category Details</label>
                  <input
                    name="otherCategoryDetail"
                    value={formData.otherCategoryDetail}
                    onChange={handleInputChange}
                    placeholder="e.g. Heritage restoration"
                  />
                </div>
              )}

              <div className="registration-field">
                <label>Service Areas</label>
                <div className="registration-chip-group">
                  {serviceAreaOptions.map((area) => (
                    <button
                      type="button"
                      key={area}
                      className={`registration-chip ${formData.serviceAreas.includes(area) ? 'is-active' : ''}`}
                      onClick={() => toggleSelection('serviceAreas', area)}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {otherAreaSelected && (
                <div className="registration-field">
                  <label>Other Service Areas</label>
                  <input
                    name="otherServiceAreaDetail"
                    value={formData.otherServiceAreaDetail}
                    onChange={handleInputChange}
                    placeholder="e.g. Cross-border projects, seasonal work"
                  />
                </div>
              )}
            </>
          )}

          {/* STEP 2: Verification */}
          {currentStep === 2 && (
            <div className="verification-card">
              <div className="verification-card__intro">
                <h3>Identity & Insurance verification</h3>
                <p>
                  Upload clear copies of your documents. We accept PDF and image formats up to 5MB per
                  file.
                </p>
              </div>

              {uploadFields.map((field) => {
                const isUploading = uploadProgress[field] > 0 && uploadProgress[field] < 100
                const isSuccess = uploadProgress[field] === 100

                return (
                  <div
                    key={field}
                    className={`registration-field registration-field--upload ${
                      errors[field] ? 'has-error' : ''
                    }`}
                  >
                    <div className="registration-field__header">
                      <label className="registration-field__label" htmlFor={`${field}-upload`}>
                        {fileLabels[field]}
                        {optionalFields.has(field) && (
                          <span className="registration-field__tag">Optional</span>
                        )}
                      </label>
                      <div className="upload-status">
                        {isUploading && (
                          <>
                            <span className="upload-status__spinner" aria-hidden="true" />
                            <div className="upload-progress" aria-hidden="true">
                              <div
                                className="upload-progress__bar"
                                style={{ width: `${Math.max(uploadProgress[field], 10)}%` }}
                              />
                            </div>
                            <span className="upload-status__text">Uploading… {uploadProgress[field]}%</span>
                          </>
                        )}
                        {isSuccess && (
                          <span className="upload-status__success" role="status">
                            <span aria-hidden="true">✓</span> Uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`upload-dropzone ${dragStates[field] ? 'is-dragover' : ''} ${
                        isSuccess ? 'is-success' : ''
                      } ${errors[field] ? 'has-error' : ''}`}
                      onDragEnter={handleDragEnter(field)}
                      onDragOver={handleDragOver(field)}
                      onDragLeave={handleDragLeave(field)}
                      onDrop={handleDrop(field)}
                    >
                      <input
                        id={`${field}-upload`}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange(field)}
                        className="upload-dropzone__input"
                        aria-describedby={`${field}-upload-hint`}
                        aria-label={`${fileLabels[field]} upload`}
                      />
                      <div className="upload-dropzone__content">
                        <span className="upload-dropzone__action">Click to upload</span>
                        <span className="upload-dropzone__hint">or drag & drop</span>
                        <span className="upload-dropzone__meta">PDF, JPG, PNG · 5MB max</span>
                      </div>
                    </div>

                    {previews[field] && (
                      <div className="upload-preview">
                        <img src={previews[field]} alt={`${fileLabels[field]} preview`} />
                      </div>
                    )}

                    {!previews[field] && uploadedDocuments[field]?.name && (
                      <div className="upload-file-meta">
                        <span className="upload-file-meta__name">{uploadedDocuments[field].name}</span>
                        {uploadedDocuments[field]?.url && (
                          <a
                            href={uploadedDocuments[field].url}
                            target="_blank"
                            rel="noreferrer"
                            className="upload-file-meta__link"
                          >
                            View
                          </a>
                        )}
                      </div>
                    )}

                    <p id={`${field}-upload-hint`} className="registration-hint">
                      PDF, JPG or PNG formats. 5MB maximum per file.
                    </p>

                    {errors[field] && (
                      <p className="registration-hint registration-hint--error">{errors[field]}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* STEP 3: Confirm */}
          {currentStep === 3 && (
            <>
              <h3>Review & Confirm</h3>
              <p>{formData.fullName}</p>
              <label>
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleConsentChange}
                />
                I confirm all details are correct.
              </label>
            </>
          )}

          <div className="registration-step-actions">
            {currentStep > 1 && (
              <button type="button" onClick={handleBack}>
                Back
              </button>
            )}
            {currentStep < 3 && (
              <button type="button" onClick={handleNext}>
                Continue
              </button>
            )}
            {currentStep === 3 && (
              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            )}
          </div>

          {submissionError && <p className="error">{submissionError}</p>}
          {submissionSuccess && <p className="success">Submitted successfully ✅</p>}
        </form>
      </div>
    </div>
  )
}
