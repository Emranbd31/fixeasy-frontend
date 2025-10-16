'use client'

import { useEffect, useState } from 'react'
import RegistrationLayout from '../../../../components/RegistrationLayout'
import TermsCheckbox from '../../../../components/TermsCheckbox'
import TurnstileNotice from '../../../../components/TurnstileNotice'
import { SERVICE_CATEGORIES } from '../../../../data/service-categories'
import {
  sanitizeText,
  sanitizePhone,
  isValidIrishPhone,
  isValidPpsNumber,
  isValidCompanyNumber
} from '../../../../lib/validation'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  registrationNumber: '',
  ppsNumber: '',
  categories: [],
  serviceArea: '',
  availability: '',
  bankAccountToken: '',
  acceptTerms: false
}

export default function ProfessionalSignupPage() {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [termsVersion, setTermsVersion] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/legal/terms')
      .then((response) => response.json())
      .then((data) => {
        if (mounted && data?.ok) {
          setTermsVersion(data.version)
        }
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const updateField = (event) => {
    const { name, value, type, checked, options } = event.target
    if (type === 'select-multiple') {
      const selected = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value)
      setFormData((prev) => ({ ...prev, [name]: selected }))
      return
    }
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    const validationErrors = {}
    if (!sanitizeText(formData.fullName)) validationErrors.fullName = 'Enter a primary contact name.'
    if (!/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(sanitizeText(formData.email))) {
      validationErrors.email = 'Provide a valid email address.'
    }
    if (!isValidIrishPhone(formData.phone)) {
      validationErrors.phone = 'Use an Irish phone number in +353 format.'
    }
    if (!sanitizeText(formData.companyName)) {
      validationErrors.companyName = 'Add your trading or business name.'
    }
    if (!isValidCompanyNumber(formData.registrationNumber)) {
      validationErrors.registrationNumber = 'Provide your CRO/RBN/BRN number.'
    }
    if (!isValidPpsNumber(formData.ppsNumber)) {
      validationErrors.ppsNumber = 'Enter a valid PPS number.'
    }
    if (!formData.categories?.length) {
      validationErrors.categories = 'Select at least one service category.'
    }
    if (!sanitizeText(formData.serviceArea)) {
      validationErrors.serviceArea = 'Describe your service coverage or radius.'
    }
    if (!sanitizeText(formData.bankAccountToken)) {
      validationErrors.bankAccountToken = 'Connect a Stripe bank account token.'
    }
    if (!formData.acceptTerms || !termsVersion) {
      validationErrors.acceptTerms = 'Accept the latest Terms & Conditions to continue.'
    }
    return validationErrors
  }

  const submit = async (event) => {
    event.preventDefault()
    setErrors({})
    setResult(null)
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        accountType: 'professional',
        fullName: sanitizeText(formData.fullName),
        email: sanitizeText(formData.email).toLowerCase(),
        phone: sanitizePhone(formData.phone),
        companyName: sanitizeText(formData.companyName),
        registrationNumber: sanitizeText(formData.registrationNumber).toUpperCase(),
        ppsNumber: sanitizeText(formData.ppsNumber).toUpperCase(),
        categories: formData.categories,
        serviceArea: sanitizeText(formData.serviceArea),
        availability: sanitizeText(formData.availability),
        bankAccountToken: sanitizeText(formData.bankAccountToken),
        termsVersion,
        termsAcceptedAt: new Date().toISOString()
      }
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!response.ok) {
        setErrors(data?.field ? { [data.field]: data.message } : { form: data?.message || 'Unable to onboard now.' })
        return
      }
      setResult(data)
      setFormData(initialState)
    } catch (error) {
      setErrors({ form: 'We could not reach the onboarding service. Try again shortly.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <RegistrationLayout
      eyebrow="Professional onboarding"
      title="Verify your credentials to unlock FixEasy jobs"
      intro="Stripe Connect Identity, insurance, and tax evidence keep every booking compliant."
      aside={
        <div className="grid" style={{ gap: '1rem' }}>
          <div>
            <h3>Verification checklist</h3>
            <ul>
              <li>Identity document and address proof</li>
              <li>Insurance certificate PDF</li>
              <li>Tax clearance reference</li>
              <li>Bank account tokenised via Stripe Connect</li>
            </ul>
          </div>
          <TurnstileNotice />
        </div>
      }
    >
      <form onSubmit={submit} className="grid" style={{ gap: '1.5rem' }}>
        {errors.form ? <p className="form-error">{errors.form}</p> : null}
        {result ? (
          <div className="notice" role="status">
            <strong>Submission received.</strong> Reference {result.reference}. We will update your Stripe Connect verification at{' '}
            {new Date(result.receivedAt).toLocaleString('en-IE')}.
          </div>
        ) : null}
        <div className="grid grid-2">
          <div className="form-field">
            <label htmlFor="fullName">Primary contact</label>
            <input id="fullName" name="fullName" value={formData.fullName} onChange={updateField} />
            {errors.fullName ? <p className="form-error">{errors.fullName}</p> : null}
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={formData.email} onChange={updateField} />
            {errors.email ? <p className="form-error">{errors.email}</p> : null}
          </div>
        </div>
        <div className="grid grid-2">
          <div className="form-field">
            <label htmlFor="phone">Phone (+353…)</label>
            <input id="phone" name="phone" value={formData.phone} onChange={updateField} />
            {errors.phone ? <p className="form-error">{errors.phone}</p> : null}
          </div>
          <div className="form-field">
            <label htmlFor="companyName">Business name</label>
            <input id="companyName" name="companyName" value={formData.companyName} onChange={updateField} />
            {errors.companyName ? <p className="form-error">{errors.companyName}</p> : null}
          </div>
        </div>
        <div className="grid grid-2">
          <div className="form-field">
            <label htmlFor="registrationNumber">CRO/RBN/BRN</label>
            <input id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={updateField} />
            {errors.registrationNumber ? <p className="form-error">{errors.registrationNumber}</p> : null}
          </div>
          <div className="form-field">
            <label htmlFor="ppsNumber">PPS number</label>
            <input id="ppsNumber" name="ppsNumber" value={formData.ppsNumber} onChange={updateField} />
            {errors.ppsNumber ? <p className="form-error">{errors.ppsNumber}</p> : null}
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="categories">Service categories</label>
          <select
            id="categories"
            name="categories"
            multiple
            value={formData.categories}
            onChange={updateField}
            size={Math.min(8, SERVICE_CATEGORIES.length)}
          >
            {SERVICE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.categories ? <p className="form-error">{errors.categories}</p> : null}
        </div>
        <div className="form-field">
          <label htmlFor="serviceArea">Areas covered</label>
          <textarea id="serviceArea" name="serviceArea" value={formData.serviceArea} onChange={updateField} rows={3} />
          {errors.serviceArea ? <p className="form-error">{errors.serviceArea}</p> : null}
        </div>
        <div className="form-field">
          <label htmlFor="availability">Availability pattern</label>
          <textarea id="availability" name="availability" value={formData.availability} onChange={updateField} rows={3} />
        </div>
        <div className="form-field">
          <label htmlFor="bankAccountToken">Stripe bank account token</label>
          <input id="bankAccountToken" name="bankAccountToken" value={formData.bankAccountToken} onChange={updateField} />
          {errors.bankAccountToken ? <p className="form-error">{errors.bankAccountToken}</p> : null}
        </div>
        <TermsCheckbox
          checked={formData.acceptTerms}
          onChange={(value) => setFormData((prev) => ({ ...prev, acceptTerms: value }))}
          termsVersion={termsVersion}
          error={errors.acceptTerms}
        />
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit verification'}
        </button>
      </form>
    </RegistrationLayout>
  )
}
