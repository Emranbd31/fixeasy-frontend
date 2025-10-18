import { isValidIrishPhone, sanitizePhone, sanitizeText } from '../../../lib/validation'

const EMAIL_REGEX = /^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/
const OTHER_OPTION = 'Other (please specify)'

function error(message, field) {
  return { ok: false, error: message, field }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json(error('Method not allowed.'))
  }

  const {
    fullName,
    email,
    phone,
    serviceCategories,
    otherCategoryDetail,
    serviceAreas,
    consent,
    verificationDocuments
  } = req.body ?? {}

  const normalizedFullName = sanitizeText(fullName)
  const normalizedEmail = sanitizeText(email).toLowerCase()
  const normalizedOtherCategory = sanitizeText(otherCategoryDetail)
  const normalizedServiceCategories = Array.isArray(serviceCategories)
    ? serviceCategories.map((category) => sanitizeText(category)).filter(Boolean)
    : []
  const normalizedServiceAreas = Array.isArray(serviceAreas)
    ? serviceAreas.map((area) => sanitizeText(area)).filter(Boolean)
    : []
  const normalizedDocuments = {
    photo_id_url: sanitizeText(verificationDocuments?.photo_id_url),
    selfie_url: sanitizeText(verificationDocuments?.selfie_url),
    insurance_url: sanitizeText(verificationDocuments?.insurance_url)
  }

  if (!normalizedFullName) {
    return res.status(400).json(error('Enter your full name or business name.', 'fullName'))
  }

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json(error('Provide a valid contact email.', 'email'))
  }

  if (!isValidIrishPhone(phone)) {
    return res.status(400).json(error('Use an Irish phone number in +353 format.', 'phone'))
  }

  if (normalizedServiceCategories.length === 0) {
    return res.status(400).json(error('Select at least one service category.', 'serviceCategories'))
  }

  if (normalizedServiceCategories.includes(OTHER_OPTION) && !normalizedOtherCategory) {
    return res.status(400).json(error('Describe the additional service you offer.', 'otherCategoryDetail'))
  }

  if (normalizedServiceAreas.length === 0) {
    return res.status(400).json(error('Select at least one service area.', 'serviceAreas'))
  }

  if (!normalizedDocuments.photo_id_url) {
    return res.status(400).json(error('Photo ID is required.', 'verificationDocuments.photo_id_url'))
  }

  if (!normalizedDocuments.selfie_url) {
    return res.status(400).json(error('Selfie verification is required.', 'verificationDocuments.selfie_url'))
  }

  if (!consent) {
    return res
      .status(400)
      .json(error('Confirm authenticity of the supplied documents.', 'consent'))
  }

  const reference = `PRO-${Date.now().toString(36).toUpperCase()}`

  return res.status(200).json({
    ok: true,
    reference,
    receivedAt: new Date().toISOString(),
    normalized: {
      fullName: normalizedFullName,
      email: normalizedEmail,
      phone: sanitizePhone(phone),
      serviceCategories: normalizedServiceCategories,
      otherCategoryDetail: normalizedOtherCategory,
      serviceAreas: normalizedServiceAreas,
      consent: Boolean(consent),
      verificationDocuments: {
        photo_id_url: normalizedDocuments.photo_id_url,
        selfie_url: normalizedDocuments.selfie_url,
        insurance_url: normalizedDocuments.insurance_url
      }
    }
  })
}
