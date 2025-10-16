import { useState } from 'react'
import Head from 'next/head'

const serviceCategories = [
  'Plumbing & heating',
  'Electrical & EV',
  'Cleaning & facilities',
  'Carpentry & fit-out',
  'Landscaping & outdoors',
  'Painting & finishing',
  'Appliance repair',
  'Handyman & general maintenance'
]

const identityRequirements = [
  'Valid Irish passport or EU/EEA passport',
  'Irish/UK driver licence (front & back) or Irish Residence Permit',
  'Company or sole trader registration (CRO/RBN)'
]

const complianceDocuments = [
  'Public liability insurance (minimum €2m cover)',
  'Employers liability insurance (if applicable)',
  'Revenue tax clearance certificate or ROS screenshot (last 12 months)',
  'Safe Electric, RGI, or equivalent trade certifications where required'
]

const onboardingMilestones = [
  {
    title: 'Document check (same day)',
    detail: 'Our compliance analysts validate identity, insurance and certifications before activating job access.'
  },
  {
    title: 'Availability sync',
    detail: 'Upload your service areas and working hours to unlock instant job notifications in the FixEasy pro app.'
  },
  {
    title: 'First secure payout',
    detail: 'Stripe Connect handles weekly payouts to your Irish bank account with line-item job summaries and VAT breakdowns.'
  }
]

const initialState = {
  businessName: '',
  tradingName: '',
  contactName: '',
  email: '',
  phone: '',
  serviceCounties: '',
  experienceYears: '',
  staffCount: '',
  services: [],
  registrationNumber: '',
  insuranceExpiry: '',
  idDocument: null,
  insuranceDocument: null,
  taxDocument: null,
  certifications: null,
  acceptPolicies: false
}

export default function ProfessionalRegistration() {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (event) => {
    const { name, value, type, checked, files } = event.target

    if (type === 'checkbox' && name === 'acceptPolicies') {
      setFormData((prev) => ({ ...prev, [name]: checked }))
      return
    }

    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files?.[0] ?? null }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceToggle = (service) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service)
      return {
        ...prev,
        services: exists ? prev.services.filter((item) => item !== service) : [...prev.services, service]
      }
    })
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.businessName.trim()) {
      nextErrors.businessName = 'Enter your registered business or sole trader name.'
    }

    if (!formData.contactName.trim()) {
      nextErrors.contactName = 'Provide the primary contact responsible for compliance.'
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Add a valid email for onboarding updates.'
    }

    if (!formData.phone.trim() || !/^\+?353\d{8,9}$/.test(formData.phone.replace(/\s+/g, ''))) {
      nextErrors.phone = 'Use an Irish mobile or landline in +353 format.'
    }

    if (!formData.serviceCounties.trim()) {
      nextErrors.serviceCounties = 'List the Irish counties or districts you cover.'
    }

    if (!formData.experienceYears.trim()) {
      nextErrors.experienceYears = 'Share years of professional experience in your trade.'
    }

    if (formData.services.length === 0) {
      nextErrors.services = 'Select at least one service category you deliver.'
    }

    if (!formData.registrationNumber.trim()) {
      nextErrors.registrationNumber = 'Include CRO, RBN or VAT number as applicable.'
    }

    if (!formData.insuranceExpiry.trim()) {
      nextErrors.insuranceExpiry = 'Confirm when your liability insurance expires.'
    }

    if (!formData.idDocument) {
      nextErrors.idDocument = 'Upload the front page of your passport, driver licence or IRP.'
    }

    if (!formData.insuranceDocument) {
      nextErrors.insuranceDocument = 'Upload proof of insurance coverage (PDF or image).'
    }

    if (!formData.taxDocument) {
      nextErrors.taxDocument = 'Upload a current Revenue tax clearance certificate or ROS screenshot.'
    }

    if (!formData.acceptPolicies) {
      nextErrors.acceptPolicies = 'Confirm that submitted documents are valid and up to date.'
    }

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(false)
    const validation = validate()

    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setErrors({})
    setSubmitted(true)
    // Production: send payload to pro onboarding API with secure storage via signed URLs and Stripe Connect onboarding trigger.
  }

  const renderServiceOption = (service) => (
    <label key={service} className="registration-field registration-field--option">
      <input
        type="checkbox"
        name="services"
        value={service}
        checked={formData.services.includes(service)}
        onChange={() => handleServiceToggle(service)}
      />
      {service}
    </label>
  )

  return (
    <div className="registration-layout">
      <Head>
        <title>Professional onboarding — FixEasy</title>
        <meta
          name="description"
          content="Join FixEasy as an Irish professional with secure identity checks, insurance validation, and compliance-ready payouts."
        />
      </Head>

      <div className="registration-layout__container">
        <header className="registration-header">
          <span className="registration-header__eyebrow">Professional onboarding</span>
          <h1 className="registration-header__title">Work with FixEasy clients across Ireland</h1>
          <p className="registration-header__intro">
            Submit your compliance pack to unlock verified jobs, instant messaging, digital worksheets, and automatic payouts
            via Stripe Connect. We only partner with fully credentialed teams who meet Irish safety and insurance standards.
          </p>
        </header>

        <div className="registration-grid">
          <section className="registration-card">
            <div>
              <h2 className="registration-card__title">Compliance &amp; capability details</h2>
              <p className="registration-note">
                FixEasy performs enhanced due diligence with CRO, Revenue, and trade bodies. Upload clear scans and ensure names
                match across all documents to avoid delays.
              </p>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="registration-errors" role="alert">
                <strong>We need a few updates:</strong>
                <ul>
                  {Object.values(errors).map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

            {submitted && (
              <div className="registration-success" role="status">
                <span>Thanks for sharing your credentials.</span>
                <span>
                  Our compliance team will review and schedule your onboarding call within one business day. Confirmation will be
                  sent to <strong>{formData.email}</strong> along with Stripe Connect setup instructions.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="registration-form" noValidate>
              <fieldset className="registration-fieldset">
                <legend>Business information</legend>
                <div className="registration-two-column">
                  <div className="registration-field">
                    <label htmlFor="businessName">Registered business / sole trader name</label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.businessName)}
                    />
                  </div>
                  <div className="registration-field">
                    <label htmlFor="tradingName">Trading name (if different)</label>
                    <input
                      id="tradingName"
                      name="tradingName"
                      type="text"
                      value={formData.tradingName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="registration-two-column">
                  <div className="registration-field">
                    <label htmlFor="contactName">Primary contact name</label>
                    <input
                      id="contactName"
                      name="contactName"
                      type="text"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.contactName)}
                    />
                  </div>
                  <div className="registration-field">
                    <label htmlFor="email">Contact email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
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
                      placeholder="+353861234567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.phone)}
                    />
                  </div>
                  <div className="registration-field">
                    <label htmlFor="serviceCounties">Service counties / catchment</label>
                    <input
                      id="serviceCounties"
                      name="serviceCounties"
                      type="text"
                      placeholder="Dublin, Meath, Kildare"
                      value={formData.serviceCounties}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.serviceCounties)}
                    />
                  </div>
                </div>

                <div className="registration-two-column">
                  <div className="registration-field">
                    <label htmlFor="experienceYears">Years in operation</label>
                    <input
                      id="experienceYears"
                      name="experienceYears"
                      type="number"
                      min="0"
                      value={formData.experienceYears}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.experienceYears)}
                    />
                  </div>
                  <div className="registration-field">
                    <label htmlFor="staffCount">Number of field staff</label>
                    <input
                      id="staffCount"
                      name="staffCount"
                      type="number"
                      min="1"
                      value={formData.staffCount}
                      onChange={handleInputChange}
                    />
                    <p className="registration-hint">Helps us tailor routing and staffing recommendations.</p>
                  </div>
                </div>
              </fieldset>

              <fieldset className="registration-fieldset">
                <legend>Services offered</legend>
                <div className="registration-field">
                  <span className="registration-hint">Select all categories you are qualified and insured to deliver.</span>
                  <div className="registration-two-column">
                    {serviceCategories.map((service) => renderServiceOption(service))}
                  </div>
                  {errors.services && <p className="registration-hint" role="alert">{errors.services}</p>}
                </div>
              </fieldset>

              <fieldset className="registration-fieldset">
                <legend>Compliance uploads</legend>
                <div className="registration-two-column">
                  <div className="registration-field">
                    <label htmlFor="registrationNumber">CRO / RBN / VAT number</label>
                    <input
                      id="registrationNumber"
                      name="registrationNumber"
                      type="text"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.registrationNumber)}
                    />
                  </div>
                  <div className="registration-field">
                    <label htmlFor="insuranceExpiry">Insurance expiry date</label>
                    <input
                      id="insuranceExpiry"
                      name="insuranceExpiry"
                      type="date"
                      value={formData.insuranceExpiry}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.insuranceExpiry)}
                    />
                  </div>
                </div>

                <div className="registration-two-column">
                  <div className="registration-field">
                    <label htmlFor="idDocument">
                      Upload identity &amp; registration <span className="registration-required">Required</span>
                    </label>
                    <input
                      id="idDocument"
                      name="idDocument"
                      type="file"
                      accept="application/pdf,image/jpeg,image/png"
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.idDocument)}
                    />
                    <p className="registration-hint">Combine passport/IRP and CRO certificate into one file if needed.</p>
                  </div>
                  <div className="registration-field">
                    <label htmlFor="insuranceDocument">
                      Upload insurance certificate <span className="registration-required">Required</span>
                    </label>
                    <input
                      id="insuranceDocument"
                      name="insuranceDocument"
                      type="file"
                      accept="application/pdf,image/jpeg,image/png"
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.insuranceDocument)}
                    />
                    <p className="registration-hint">Ensure the document shows policy number, cover level, and expiry.</p>
                  </div>
                </div>

                <div className="registration-two-column">
                  <div className="registration-field">
                    <label htmlFor="taxDocument">
                      Upload tax clearance evidence <span className="registration-required">Required</span>
                    </label>
                    <input
                      id="taxDocument"
                      name="taxDocument"
                      type="file"
                      accept="application/pdf,image/jpeg,image/png"
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.taxDocument)}
                    />
                    <p className="registration-hint">ROS screenshot must display the verification code and expiry date.</p>
                  </div>
                  <div className="registration-field">
                    <label htmlFor="certifications">Trade certifications (optional)</label>
                    <input
                      id="certifications"
                      name="certifications"
                      type="file"
                      accept="application/pdf,image/jpeg,image/png"
                      onChange={handleInputChange}
                    />
                    <p className="registration-hint">Safe Pass, Safe Electric, RGI or similar credentials.</p>
                  </div>
                </div>
              </fieldset>

              <div className="registration-actions">
                <button type="submit" className="registration-submit">
                  Submit compliance pack
                </button>
                <div className="registration-consent">
                  <label htmlFor="pro-consent">
                    <input
                      id="pro-consent"
                      type="checkbox"
                      name="acceptPolicies"
                      checked={formData.acceptPolicies}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.acceptPolicies)}
                    />
                    I confirm all documents are valid, Irish-compliant, and I agree to FixEasy pro standards.
                  </label>
                  {errors.acceptPolicies && (
                    <p className="registration-hint registration-hint--error">{errors.acceptPolicies}</p>
                  )}
                </div>
              </div>
            </form>
          </section>

          <aside className="registration-aside" aria-label="Professional onboarding guidance">
            <div className="registration-aside__card">
              <span className="registration-aside__badge">Identity</span>
              <h2 className="registration-aside__title">Required Irish documents</h2>
              <ul className="registration-aside__list">
                {identityRequirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="registration-aside__card">
              <span className="registration-aside__badge">Insurance &amp; tax</span>
              <h2 className="registration-aside__title">Upload clear, current copies</h2>
              <ul className="registration-aside__list">
                {complianceDocuments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="registration-aside__card">
              <span className="registration-aside__badge">Next steps</span>
              <h2 className="registration-aside__title">Your first 48 hours with FixEasy</h2>
              <div className="registration-stepper">
                {onboardingMilestones.map((milestone) => (
                  <div key={milestone.title} className="registration-step">
                    <strong>{milestone.title}</strong>
                    <span>{milestone.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="registration-review">
              <strong>Need help preparing your pack?</strong>
              <span>
                Email pros@fixeasy.ie or call +353 1 963 8120. We can pre-check documents and schedule a video verification call.
              </span>
            </div>
          </aside>
        </div>

        <footer className="registration-links" aria-label="Back to other areas">
          <span className="registration-tagline">Looking to book services instead?</span>
          <a href="/register/client">Go to client registration</a>
          <a href="/book">Book a FixEasy visit</a>
          <a href="/">Return to homepage</a>
        </footer>
      </div>
    </div>
  )
}
