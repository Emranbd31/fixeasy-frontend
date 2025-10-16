export const TERMS = [
  {
    version: 'v1.0',
    publishedAt: '2024-07-01T00:00:00Z',
    summary: [
      'Defines usage rules for FixEasy clients and professionals.',
      'Explains identity verification requirements and audit expectations.',
      'Outlines payment handling, dispute timelines, and data protection controls.'
    ],
    content: `
## FixEasy Terms & Conditions (v1.0)

### 1. Introduction
FixEasy connects Irish clients and vetted professionals. These terms govern every account and booking.

### 2. Identity & Access
All users must provide accurate identity information. Professionals agree to verification by Stripe Connect Identity and may be asked to re-submit documentation if details change.

### 3. Payments
Stripe processes all payments. Clients authorise FixEasy to charge stored payment methods. Professionals authorise FixEasy to manage payouts, adjustments, and disputes.

### 4. Security
Multi-factor authentication, signed webhooks, Cloudflare Turnstile, and device posture checks protect each session. Suspicious activity triggers incident response.

### 5. Data Protection
We comply with GDPR, minimise PII, and honour subject access requests. Audit logs capture every sensitive action.

### 6. Updates
We may update these terms. The latest version is always available at fixeasy.ie/terms.
`
  }
]
