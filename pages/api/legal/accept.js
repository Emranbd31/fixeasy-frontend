import { getLatestTerms } from '../../../lib/terms'
import { recordTermsAcceptance, validateTermsAcceptance } from '../../../lib/terms-audit'
import { sanitizeText } from '../../../lib/validation'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const latestTerms = getLatestTerms()
  const { accountType = 'client', email, termsVersion, termsAcceptedAt, marketingConsent, confirmAccuracy } = req.body ?? {}

  const payload = {
    email: sanitizeText(email).toLowerCase(),
    termsVersion,
    termsAcceptedAt,
    marketingConsent: Boolean(marketingConsent),
    confirmAccuracy: Boolean(confirmAccuracy)
  }

  const validation = validateTermsAcceptance(payload, latestTerms)
  if (!validation.ok) {
    return res.status(400).json(validation)
  }

  const reference = `LEGAL-${Date.now().toString(36).toUpperCase()}`
  await recordTermsAcceptance({ accountType, payload, req, reference })

  return res.status(200).json({ ok: true, reference, version: latestTerms.version })
}
