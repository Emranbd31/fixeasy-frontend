import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import CameraCapture from '../../components/CameraCapture'
import { SERVICE_OPTIONS } from '../../data/services'
import { startSupabaseOAuth } from '../../lib/oauth'
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

const LOGIN_PROVIDERS = [
  { id: 'google', label: 'Continue with Google', icon: '🟦' },
  { id: 'apple', label: 'Continue with Apple', icon: '' }
]

const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png']
const uploadFields = ['photoId', 'selfie', 'insurance']
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_PRO_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PRO_BUCKET || 'pro-verifications'

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
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [oauthError, setOauthError] = useState('')

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

  const handleOAuth = async (provider) => {
    try {
      setOauthError('')
      await startSupabaseOAuth(provider, 'pro')
    } catch (error) {
      setOauthError(error.message)
    }
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

    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase Storage is not configured.')
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
          'x-upsert': 'true'
        },
        body
      })

      if (!response.ok) throw new Error('Upload failed. Please try again.')

      setUploadProgress((prev) => ({ ...prev, [field]: 100 }))
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
    }
  }

  const processFile = async (field, file) => {
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
    await processFile(field, file)
  }

  const handleSelfieCapture = async (file) => {
    if (!file) {
      setIsCameraOpen(false)
      return
    }

    try {
      await processFile('selfie', file)
    } finally {
      setIsCameraOpen(false)
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
    setSubmissionSuccess(false)
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
          {currentStep === 1 ? (
            <>
              <div className="registration-login-options" role="group" aria-label="Continue with a provider">
                {LOGIN_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    className="registration-login-options__button aurora-auth-button"
                    onClick={() => handleOAuth(provider.id)}
                  >
                    <span aria-hidden="true" className="aurora-auth-button__icon">
                      {provider.icon}
                    </span>
                    {provider.label}
                  </button>
                ))}
              </div>
              {oauthError ? (
                <p role="alert" className="registration-hint registration-hint--error">
                  {oauthError}
                </p>
              ) : null}
              <div className="registration-divider">
                <span>or continue below</span>
              </div>
            </>
          ) : null}

          {/* STEP 1: Info */}
          {currentStep === 1 && (
            <>
              <div className="registration-field">
                <label htmlFor="fullName">Full Name / Business Name</label>
                <input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                {errors.fullName ? (
                  <p className="registration-hint registration-hint--error">{errors.fullName}</p>
                ) : null}
              </div>

              <div className="registration-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                {errors.email ? (
                  <p className="registration-hint registration-hint--error">{errors.email}</p>
                ) : null}
              </div>

              <div className="registration-field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                {errors.phone ? (
                  <p className="registration-hint registration-hint--error">{errors.phone}</p>
                ) : null}
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
                {errors.serviceCategories ? (
                  <p className="registration-hint registration-hint--error">{errors.serviceCategories}</p>
                ) : null}
              </div>

              {otherCategorySelected && (
                <div className="registration-field">
                  <label htmlFor="otherCategoryDetail">Other Category Details</label>
                  <input
                    id="otherCategoryDetail"
                    name="otherCategoryDetail"
                    value={formData.otherCategoryDetail}
                    onChange={handleInputChange}
                    placeholder="e.g. Heritage restoration"
                  />
                  {errors.otherCategoryDetail ? (
                    <p className="registration-hint registration-hint--error">{errors.otherCategoryDetail}</p>
                  ) : null}
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
                {errors.serviceAreas ? (
                  <p className="registration-hint registration-hint--error">{errors.serviceAreas}</p>
                ) : null}
              </div>

              {otherAreaSelected && (
                <div className="registration-field">
                  <label htmlFor="otherServiceAreaDetail">Other Service Areas</label>
                  <input
                    id="otherServiceAreaDetail"
                    name="otherServiceAreaDetail"
                    value={formData.otherServiceAreaDetail}
                    onChange={handleInputChange}
                    placeholder="e.g. Cross-border projects, seasonal work"
                  />
                  {errors.otherServiceAreaDetail ? (
                    <p className="registration-hint registration-hint--error">{errors.otherServiceAreaDetail}</p>
                  ) : null}
                </div>
              )}
            </>
          )}

          {/* STEP 2: Verification */}
          {currentStep === 2 && (
            <>
              {uploadFields.map((field) => {
                const progress = uploadProgress[field]
                const uploadedName = uploadedDocuments[field]?.name
                const optional = optionalFields.has(field)

                return (
                  <div key={field} className="registration-field registration-field--upload">
                    <label htmlFor={`${field}-upload`}>
                      {fileLabels[field]}
                      {optional ? <span className="registration-optional">Optional</span> : null}
                    </label>
                    <div className="registration-upload-controls">
                      <input
                        id={`${field}-upload`}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange(field)}
                      />
                      {field === 'selfie' ? (
                        <button
                          type="button"
                          className="registration-secondary registration-upload__camera"
                          onClick={() => setIsCameraOpen(true)}
                        >
                          Use camera
                        </button>
                      ) : null}
                    </div>

                    {previews[field] ? (
                      <img
                        src={previews[field]}
                        alt={`${fileLabels[field]} preview`}
                        className="registration-upload__preview"
                      />
                    ) : null}

                    {progress > 0 && progress < 100 ? (
                      <p className="registration-hint">Uploading… {progress}%</p>
                    ) : null}

                    {uploadedName ? (
                      <p className="registration-success">Uploaded: {uploadedName}</p>
                    ) : null}

                    {errors[field] ? (
                      <p className="registration-hint registration-hint--error">{errors[field]}</p>
                    ) : null}
                  </div>
                )
              })}
            </>
          )}

          {/* STEP 3: Confirm */}
          {currentStep === 3 && (
            <>
              <h3>Review & Confirm</h3>
              <p className="registration-summary">{formData.fullName}</p>
              <label className="registration-checkbox">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleConsentChange}
                />
                <span>I confirm all details are accurate and documents are genuine.</span>
              </label>
              {errors.consent ? (
                <p className="registration-hint registration-hint--error">{errors.consent}</p>
              ) : null}
            </>
          )}

          <div className="registration-step-actions">
            {currentStep > 1 && (
              <button type="button" className="registration-secondary" onClick={handleBack}>
                Back
              </button>
            )}
            {currentStep < 3 && (
              <button type="button" className="registration-primary" onClick={handleNext}>
                Continue
              </button>
            )}
            {currentStep === 3 && (
              <button
                type="submit"
                className="registration-primary"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? 'Submitting…' : 'Submit application'}
              </button>
            )}
          </div>

          {submissionError ? (
            <p role="alert" className="registration-hint registration-hint--error">
              {submissionError}
            </p>
          ) : null}

          {submissionSuccess ? (
            <p role="status" className="registration-success">
              Application received — we’ll email you once verification is complete.
            </p>
          ) : null}

        </form>
        <CameraCapture isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleSelfieCapture} />
      </div>
    </div>
  )
}
