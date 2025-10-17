export const TERMS_VERSIONS = [
  {
    version: 'v1.0',
    effectiveDate: '2024-07-01',
    summary: [
      'Defines FixEasy client and professional platform usage expectations.',
      'Explains verification, scheduling, payment, and dispute processes.',
      'Details GDPR-compliant data handling and security obligations.'
    ],
    contentHtml: `
      <h2>1. Introduction</h2>
      <p>These Terms &amp; Conditions govern access to the FixEasy marketplace for clients and professionals operating within Ireland. By creating an account you agree to comply with all requirements listed below.</p>
      <h2>2. Eligibility</h2>
      <p>You must be at least 18 years old. Professionals must be appropriately certified and insured for all services offered.</p>
      <h2>3. Identity &amp; Verification</h2>
      <p>All users agree to provide accurate identity information. Professionals consent to verification using Stripe Connect Identity and may be required to re-submit documentation if changes occur.</p>
      <h2>4. Service Standards</h2>
      <p>Bookings must be completed in accordance with Irish consumer protection legislation. Professionals must maintain insurance and respond to escalations within published SLAs.</p>
      <h2>5. Payments &amp; Fees</h2>
      <p>Payments are processed via Stripe. Clients authorise FixEasy to charge stored payment methods. Professionals authorise FixEasy to manage payouts, adjustments, and chargebacks in line with Stripe Connect agreements.</p>
      <h2>6. Data Protection</h2>
      <p>FixEasy processes personal data in accordance with our Privacy Policy and GDPR obligations. You can submit Data Subject Requests at any time.</p>
      <h2>7. Terms Updates</h2>
      <p>We may update these Terms from time to time. The latest version and effective date will always be published on fixeasy.ie/terms. You will be prompted to re-accept when material changes occur.</p>
      <h2>8. Contact</h2>
      <p>For questions, contact <a href="mailto:compliance@fixeasy.ie">compliance@fixeasy.ie</a>.</p>
    `
  }
]

export function getLatestTerms() {
  return TERMS_VERSIONS[0]
}
