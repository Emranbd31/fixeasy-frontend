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

  // Reset "Other service" when deselected
  useEffect(() => {
    if (!otherCategorySelected && formData.otherCategoryDetail) {
      setFormData((prev) => ({ ...prev, otherCategoryDetail: '' }))
    }
  }, [formData.otherCategoryDetail, otherCategorySelected])

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

  const handleFileChange = (field) => async (event) => {
    const file = event.target.files?.[0]
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
            </>
          )}

          {/* STEP 2: Verification */}
          {currentStep === 2 && (
            <>
              {uploadFields.map((field) => (
                <div key={field} className="registration-field">
                  <label>{fileLabels[field]}</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange(field)}
                  />
                  {previews[field] && <img src={previews[field]} alt="Preview" style={{ maxWidth: '150px' }} />}
                  {uploadedDocuments[field]?.name && (
                    <p>Uploaded: {uploadedDocuments[field].name}</p>
                  )}
                </div>
              ))}
            </>
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
