'use client'

import { useEffect, useState } from 'react'
import RegistrationLayout from '../../../../components/RegistrationLayout'
import TermsCheckbox from '../../../../components/TermsCheckbox'
import TurnstileNotice from '../../../../components/TurnstileNotice'
import { sanitizeText, sanitizePhone, isValidIrishPhone, isValidEircode } from '../../../../lib/validation'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  eircode: '',
  marketingConsent: false,
  acceptTerms: false
}

export default function ClientSignupPage() {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [termsVersion, setTermsVersion] = useState(null)

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
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    const validationErrors = {}
    if (!sanitizeText(formData.fullName)) {
      validationErrors.fullName = 'Enter your full legal name.'
    }
    if (!/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(sanitizeText(formData.email))) {
      validationErrors.email = 'Provide a valid email address.'
    }
    if (!isValidIrishPhone(formData.phone)) {
      validationErrors.phone = 'Use an Irish phone number in +353 format.'
    }
    if (!isValidEircode(formData.eircode)) {
      validationErrors.eircode = 'Add a valid Eircode (for example D02 Y006).'
    }
    if (!formData.acceptTerms || !termsVersion) {
      validationErrors.acceptTerms = 'You must accept the current Terms & Conditions.'
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
        accountType: 'client',
        fullName: sanitizeText(formData.fullName),
        email: sanitizeText(formData.email).toLowerCase(),
        phone: sanitizePhone(formData.phone),
        eircode: sanitizeText(formData.eircode).toUpperCase(),
        marketingConsent: Boolean(formData.marketingConsent),
        termsVersion,
        termsAcceptedAt: new Date().toISOString()
      }
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!response.ok) {
        setErrors(data?.field ? { [data.field]: data.message } : { form: data?.message || 'Unable to register now.' })
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
      eyebrow="Client onboarding"
      title="Create a secure FixEasy client account"
      intro="Identity-verified access unlocks instant booking, real-time updates, and GDPR-compliant history."
      aside={
        <div className="grid" style={{ gap: '1rem' }}>
          <div>
            <h3>What we collect</h3>
            <ul>
              <li>Full name and contact details</li>
              <li>Irish Eircode for service coverage</li>
              <li>Marketing preferences</li>
              <li>Mandatory Terms &amp; Conditions consent</li>
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
            <strong>Request submitted.</strong> Reference {result.reference} received at{' '}
            {new Date(result.receivedAt).toLocaleString('en-IE')}.
          </div>
        ) : null}
        <div className="grid grid-2">
          <div className="form-field">
            <label htmlFor="fullName">Full name</label>
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
            <label htmlFor="eircode">Primary Eircode</label>
            <input id="eircode" name="eircode" value={formData.eircode} onChange={updateField} />
            {errors.eircode ? <p className="form-error">{errors.eircode}</p> : null}
          </div>
        </div>
        <div className="checkbox-field">
          <input id="marketingConsent" name="marketingConsent" type="checkbox" checked={formData.marketingConsent} onChange={updateField} />
          <label htmlFor="marketingConsent">Keep me informed about FixEasy news and offers (optional).</label>
        </div>
        <TermsCheckbox
          checked={formData.acceptTerms}
          onChange={(value) => setFormData((prev) => ({ ...prev, acceptTerms: value }))}
          termsVersion={termsVersion}
          error={errors.acceptTerms}
        />
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit registration'}
        </button>
      </form>
    </RegistrationLayout>
  )
}
