import {
  isValidEircode,
  isValidIrishCompanyNumber,
  isValidIrishPhone,
  isValidPpsNumber,
  sanitizePhone,
  sanitizeText
} from '../../lib/validation'
import { getLatestTerms } from '../../lib/terms'
import { recordTermsAcceptance, validateTermsAcceptance } from '../../lib/terms-audit'

const MAX_NOTES_LENGTH = 1200
function buildError(message, field) {
  return {
    ok: false,
    error: message,
    field
  }
}

function validateClient(payload, latestTerms) {
  const {
    fullName,
    email,
    phone,
    eircode,
    idType,
    idNumber,
    addressProof,
    identityDocument,
    confirmAccuracy
  } = payload

  if (!fullName || sanitizeText(fullName).length < 4) {
    return buildError('Enter a full legal name.', 'fullName')
  }

  if (!email || !/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(email)) {
    return buildError('Provide a valid contact email.', 'email')
  }

  if (!isValidIrishPhone(phone)) {
    return buildError('Irish phone numbers must use the +353 format.', 'phone')
  }

  if (!isValidEircode(eircode)) {
    return buildError('Supply a valid Eircode for the service location.', 'eircode')
  }

  if (!idType) {
    return buildError('Select the identification document you will upload.', 'idType')
  }

  if (!idNumber || sanitizeText(idNumber).length < 4) {
    return buildError('Include the identification number.', 'idNumber')
  }

  if (!identityDocument) {
    return buildError('Attach an identification file.', 'identityDocument')
  }

  if (!addressProof) {
    return buildError('Attach proof of Irish address.', 'addressProof')
  }

  if (!confirmAccuracy) {
    return buildError('Confirm your information is accurate.', 'confirmAccuracy')
  }

  const termsResult = validateTermsAcceptance(payload, latestTerms)
  if (!termsResult.ok) {
    return termsResult
  }

  return { ok: true }
}

function validateProfessional(payload, latestTerms) {
  const {
    fullName,
    email,
    phone,
    companyName,
    registrationNumber,
    ppsNumber,
    identityDocument,
    insuranceEvidence,
    taxClearance,
    serviceRegions,
    confirmAccuracy
  } = payload

  if (!fullName || sanitizeText(fullName).length < 4) {
    return buildError('Enter the trading or director name.', 'fullName')
  }

  if (!email || !/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(email)) {
    return buildError('Provide a valid contact email.', 'email')
  }

  if (!isValidIrishPhone(phone)) {
    return buildError('Irish phone numbers must use the +353 format.', 'phone')
  }

  if (!companyName || sanitizeText(companyName).length < 2) {
    return buildError('Add the company or sole trader name.', 'companyName')
  }

  if (!registrationNumber || !isValidIrishCompanyNumber(registrationNumber)) {
    return buildError('Companies must include a CRO or RBN number.', 'registrationNumber')
  }

  if (!ppsNumber || !isValidPpsNumber(ppsNumber)) {
    return buildError('Provide a valid Irish PPS number.', 'ppsNumber')
  }

  if (!serviceRegions || serviceRegions.length === 0) {
    return buildError('Select at least one service region in Ireland.', 'serviceRegions')
  }

  if (!identityDocument) {
    return buildError('Upload a government issued ID for the account owner.', 'identityDocument')
  }

  if (!insuranceEvidence) {
    return buildError('Upload evidence of public liability insurance.', 'insuranceEvidence')
  }

  if (!taxClearance) {
    return buildError('Upload your Revenue tax clearance certificate.', 'taxClearance')
  }

  if (!confirmAccuracy) {
    return buildError('Confirm your information is accurate.', 'confirmAccuracy')
  }

  const termsResult = validateTermsAcceptance(payload, latestTerms)
  if (!termsResult.ok) {
    return termsResult
  }

  return { ok: true }
}

function normalizeFiles(entry = {}) {
  if (!entry) return null
  const { name, size } = entry
  if (!name) return null
  return {
    name,
    size: typeof size === 'number' ? size : undefined
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { type, payload } = req.body ?? {}

  if (!type || !payload) {
    return res.status(400).json(buildError('Registration type and payload required.'))
  }

  const latestTerms = getLatestTerms()
  const normalizedPayload = {
    ...payload,
    fullName: sanitizeText(payload.fullName),
    email: sanitizeText(payload.email).toLowerCase(),
    phone: sanitizePhone(payload.phone),
    notes: sanitizeText(payload.notes)
  }

  normalizedPayload.confirmAccuracy = Boolean(payload.confirmAccuracy)
  normalizedPayload.marketingConsent = Boolean(payload.marketingConsent)
  normalizedPayload.termsVersion = sanitizeText(payload.termsVersion)
  normalizedPayload.termsAcceptedAt =
    typeof payload.termsAcceptedAt === 'string' ? payload.termsAcceptedAt : ''

  if (Array.isArray(payload.serviceRegions)) {
    normalizedPayload.serviceRegions = payload.serviceRegions
      .map((region) => sanitizeText(region))
      .filter(Boolean)
  } else if (typeof payload.serviceRegions === 'string') {
    normalizedPayload.serviceRegions = payload.serviceRegions
      .split(',')
      .map((region) => sanitizeText(region))
      .filter(Boolean)
  }

  if (typeof normalizedPayload.notes === 'string' && normalizedPayload.notes.length > MAX_NOTES_LENGTH) {
    return res
      .status(400)
      .json(buildError(`Notes must be under ${MAX_NOTES_LENGTH} characters.`, 'notes'))
  }

  const validationResult =
    type === 'client'
      ? validateClient(normalizedPayload, latestTerms)
      : type === 'professional'
      ? validateProfessional(normalizedPayload, latestTerms)
      : null

  if (!validationResult) {
    return res.status(400).json(buildError('Unsupported registration type.'))
  }

  if (!validationResult.ok) {
    return res.status(400).json(validationResult)
  }

  const reference = `${type === 'client' ? 'CL' : 'PR'}-${Date.now().toString(36).toUpperCase()}`

  await recordTermsAcceptance({ accountType: type, payload: normalizedPayload, req, reference })

  return res.status(200).json({
    ok: true,
    reference,
    receivedAt: new Date().toISOString(),
    documents: {
      identity: normalizeFiles(payload.identityDocument),
      address: normalizeFiles(payload.addressProof),
      insurance: normalizeFiles(payload.insuranceEvidence),
      tax: normalizeFiles(payload.taxClearance)
    }
  })
}
