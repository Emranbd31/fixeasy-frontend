import { useState } from 'react'
import Head from 'next/head'
import { isValidEircode, isValidIrishPhone, sanitizePhone, sanitizeText } from '../../lib/validation'

const identityDocuments = [
  'Irish passport (current)',
  'Irish or EU/EEA photocard driver licence',
  'Irish Residence Permit (IRP) or GNIB card with photo',
  'Public Services Card with verified photo'
]

const addressProofOptions = [
  'Utility bill (ESB, Bord Gáis, Irish Water) dated within the last 3 months',
  'Bank or credit union statement issued to an Irish address within 3 months',
  'Revenue (ROS/myAccount) notice dated within the last year',
  'Lease or tenancy agreement registered with the RTB'
]

const safeguardingSteps = [
  {
    title: 'Digital identity verification',
    description:
      'Your document upload is encrypted in transit and reviewed by FixEasy trust & safety specialists within 1 working day.'
  },
  {
    title: 'Address validation',
    description:
      'Proof of address confirms where services can be scheduled and enables emergency assistance with Garda vetting when required.'
  },
  {
    title: 'Secure account activation',
    description:
      'Once approved, multi-factor authentication (email + TOTP) is enforced automatically for every login and booking approval.'
  }
]

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  eircode: '',
  idType: '',
  idNumber: '',
  docFile: null,
  addressFile: null,
  notes: '',
  acceptPolicies: false
}

export default function ClientRegistration() {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target

    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files?.[0] ?? null }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!sanitizeText(formData.fullName)) {
      nextErrors.fullName = 'Enter your full legal name as it appears on your identification.'
    }

    if (!sanitizeText(formData.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Provide a valid email address so we can send activation steps.'
    }

    if (!isValidIrishPhone(formData.phone)) {
      nextErrors.phone = 'Use an Irish contact number in +353 format.'
    }

    if (!isValidEircode(formData.eircode)) {
      nextErrors.eircode = 'Add the Eircode for your primary service address (e.g. D02 Y006).'
    }

    if (!formData.idType) {
      nextErrors.idType = 'Select the identification document you will upload.'
    }

    if (!formData.idNumber.trim()) {
      nextErrors.idNumber = 'Include the document number shown on your ID.'
    }

    if (!formData.docFile) {
      nextErrors.identityDocument = 'Upload a clear scan or photo of your identification document.'
    }

    if (!formData.addressFile) {
      nextErrors.addressProof = 'Upload proof of address dated within the required timeframe.'
    }

    if (!formData.acceptPolicies) {
      nextErrors.acceptPolicies = 'You must confirm that all details supplied are accurate.'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(false)
    setApiResponse(null)
    const validation = validate()

    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setErrors({})
    setSubmitting(true)

    const payload = {
      fullName: sanitizeText(formData.fullName),
      email: sanitizeText(formData.email),
      phone: sanitizePhone(formData.phone),
      eircode: sanitizeText(formData.eircode).toUpperCase(),
      idType: formData.idType,
      idNumber: sanitizeText(formData.idNumber),
      identityDocument: formData.docFile
        ? { name: formData.docFile.name, size: formData.docFile.size }
        : null,
      addressProof: formData.addressFile
        ? { name: formData.addressFile.name, size: formData.addressFile.size }
        : null,
      notes: sanitizeText(formData.notes),
      acceptPolicies: formData.acceptPolicies
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'client',
          payload
        })
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (result?.field) {
          setErrors({ [result.field]: result.error })
        } else {
          setErrors({ form: result?.error ?? 'We were unable to submit your request. Try again shortly.' })
        }
        return
      }

      setApiResponse({ ...result, email: payload.email })
      setSubmitted(true)
      setFormData({ ...initialState })
    } catch (error) {
      setErrors({ form: 'We could not reach the onboarding service. Check your connection and try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="registration-layout">
      <Head>
        <title>Client registration — FixEasy</title>
        <meta
          name="description"
          content="Register for a FixEasy client account with secure identity and address verification compliant with Irish regulations."
        />
      </Head>

      <div className="registration-layout__container">
        <header className="registration-header">
          <span className="registration-header__eyebrow">Client onboarding</span>
          <h1 className="registration-header__title">Create a secure FixEasy client account</h1>
          <p className="registration-header__intro">
            We protect every booking with Irish-standard identity and address checks. Complete the form to unlock instant
            scheduling, saved payment methods, and audited service history.
          </p>
        </header>

        <div className="registration-grid">
          <section className="registration-card">
            <div>
              <h2 className="registration-card__title">Verify your details</h2>
              <p className="registration-note">
                All uploads are handled using signed URLs and encrypted storage. We only retain documents for the minimum period
                needed to verify your account and satisfy regulatory obligations.
              </p>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="registration-errors" role="alert">
                <strong>Check the highlighted fields:</strong>
                <ul>
                  {Object.values(errors).map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

            {submitted && apiResponse && (
              <div className="registration-success" role="status">
                <span>Your registration details are ready for review.</span>
                <span>
                  Reference <strong>{apiResponse.reference}</strong> received at{' '}
                  <time dateTime={apiResponse.receivedAt}>
                    {new Date(apiResponse.receivedAt).toLocaleString('en-IE', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </time>
                  . We will confirm the FixEasy client account for <strong>{apiResponse.email}</strong> within one working day.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="registration-form" noValidate>
              <fieldset className="registration-fieldset">
                <legend>Primary contact</legend>
                <div className="registration-two-column">
                  <div className="registration-field">
                    <label htmlFor="fullName">Full name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.fullName)}
                    />
                    <p className="registration-hint">As shown on your photo identification.</p>
                  </div>
                  <div className="registration-field">
                    <label htmlFor="email">Email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.email)}
                    />
                  </div>
                </div>

                <div className="registration-two-column">
                  <div className="registration-field">
                    <label htmlFor="phone">Mobile number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+353871234567"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.phone)}
                    />
                  </div>
                  <div className="registration-field">
                    <label htmlFor="eircode">Primary service Eircode</label>
                    <input
                      id="eircode"
                      name="eircode"
                      type="text"
                      placeholder="D02 Y006"
                      value={formData.eircode}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.eircode)}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="registration-fieldset">
                <legend>Identity &amp; residency evidence</legend>
                <div className="registration-two-column">
                  <div className="registration-field">
                    <label htmlFor="idType">Identity document</label>
                    <select
                      id="idType"
                      name="idType"
                      value={formData.idType}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.idType)}
                    >
                      <option value="">Select document</option>
                      {identityDocuments.map((doc) => (
                        <option key={doc} value={doc}>
                          {doc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="registration-field">
                    <label htmlFor="idNumber">Document number</label>
                    <input
                      id="idNumber"
                      name="idNumber"
                      type="text"
                      value={formData.idNumber}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.idNumber)}
                    />
                    <p className="registration-hint">We use this to confirm authenticity with issuing authorities.</p>
                  </div>
                </div>

                <div className="registration-two-column">
                  <div className="registration-field">
                    <label htmlFor="docFile">
                      Upload identity document <span className="registration-required">Required</span>
                    </label>
                    <input
                      id="docFile"
                      name="docFile"
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.identityDocument)}
                    />
                    <p className="registration-hint">Accepted formats: PDF, JPG, PNG. Maximum size 10MB.</p>
                    {errors.identityDocument && (
                      <p className="registration-hint registration-hint--error">{errors.identityDocument}</p>
                    )}
                  </div>
                  <div className="registration-field">
                    <label htmlFor="addressFile">
                      Upload proof of address <span className="registration-required">Required</span>
                    </label>
                    <input
                      id="addressFile"
                      name="addressFile"
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.addressProof)}
                    />
                    <p className="registration-hint">Ensure the document shows your name, address, and issue date.</p>
                    {errors.addressProof && (
                      <p className="registration-hint registration-hint--error">{errors.addressProof}</p>
                    )}
                  </div>
                </div>
              </fieldset>

              <fieldset className="registration-fieldset">
                <legend>Service preferences</legend>
                <div className="registration-field">
                  <label htmlFor="notes">Notes for your FixEasy concierge (optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                  />
                  <p className="registration-hint">
                    Share concierge-level details like building access requirements, sustainability preferences, or emergency
                    contacts.
                  </p>
                </div>
              </fieldset>

              <div className="registration-actions">
                <button type="submit" className="registration-submit" disabled={submitting} aria-busy={submitting}>
                  {submitting ? 'Submitting…' : 'Submit for verification'}
                </button>
                <div className="registration-consent">
                  <label htmlFor="client-consent">
                    <input
                      id="client-consent"
                      type="checkbox"
                      name="acceptPolicies"
                      checked={formData.acceptPolicies}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.acceptPolicies)}
                    />
                    I confirm these details are accurate and I agree to FixEasy onboarding policies.
                  </label>
                  {errors.acceptPolicies && (
                    <p className="registration-hint registration-hint--error">{errors.acceptPolicies}</p>
                  )}
                </div>
              </div>
            </form>
          </section>

          <aside className="registration-aside" aria-label="Client onboarding requirements">
            <div className="registration-aside__card">
              <span className="registration-aside__badge">Identity standards</span>
              <h2 className="registration-aside__title">Accepted Irish identity documents</h2>
              <ul className="registration-aside__list">
                {identityDocuments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="registration-aside__card">
              <span className="registration-aside__badge">Address evidence</span>
              <h2 className="registration-aside__title">Documents dated within 3 months</h2>
              <ul className="registration-aside__list">
                {addressProofOptions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="registration-aside__card">
              <span className="registration-aside__badge">Safeguarding</span>
              <h2 className="registration-aside__title">How FixEasy protects your account</h2>
              <div className="registration-stepper">
                {safeguardingSteps.map((step) => (
                  <div key={step.title} className="registration-step">
                    <strong>{step.title}</strong>
                    <span>{step.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="registration-review">
              <strong>Need a hand with documentation?</strong>
              <span>
                Email onboarding@fixeasy.ie or call +353 1 963 8020. Our compliance desk operates Monday to Saturday, 08:00 –
                20:00.
              </span>
            </div>
          </aside>
        </div>

        <footer className="registration-links" aria-label="Related onboarding links">
          <span className="registration-tagline">Registering a service provider instead?</span>
          <a href="/register/pro">Go to professional onboarding</a>
          <a href="/admin">Admin console</a>
          <a href="/">Back to homepage</a>
        </footer>
      </div>
    </div>
  )
}
