import { isValidIrishPhone, sanitizePhone, sanitizeText } from '../../../lib/validation'

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
    yearsExperience,
    languages,
    verificationNotes,
    verificationDocuments
  } = req.body ?? {}

  if (!sanitizeText(fullName)) {
    return res.status(400).json(error('Enter your full name or business name.', 'fullName'))
  }

  if (!sanitizeText(email) || !/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(email)) {
    return res.status(400).json(error('Provide a valid contact email.', 'email'))
  }

  if (!isValidIrishPhone(phone)) {
    return res.status(400).json(error('Use an Irish phone number in +353 format.', 'phone'))
  }

  if (!Array.isArray(serviceCategories) || serviceCategories.length === 0) {
    return res.status(400).json(error('Select at least one service category.', 'serviceCategories'))
  }

  if (
    serviceCategories.includes('Other (please specify)') &&
    !sanitizeText(otherCategoryDetail)
  ) {
    return res.status(400).json(error('Describe the additional service you offer.', 'otherCategoryDetail'))
  }

  if (!Array.isArray(serviceAreas) || serviceAreas.length === 0) {
    return res.status(400).json(error('Select at least one service area.', 'serviceAreas'))
  }

  if (typeof yearsExperience !== 'number' || Number.isNaN(yearsExperience) || yearsExperience < 0) {
    return res.status(400).json(error('Provide your years of experience.', 'yearsExperience'))
  }

  if (!verificationDocuments || typeof verificationDocuments !== 'object') {
    return res.status(400).json(error('Upload verification documents.', 'verificationDocuments'))
  }

  const reference = `PRO-${Date.now().toString(36).toUpperCase()}`

  return res.status(200).json({
    ok: true,
    reference,
    receivedAt: new Date().toISOString(),
    normalized: {
      fullName: sanitizeText(fullName),
      email: sanitizeText(email).toLowerCase(),
      phone: sanitizePhone(phone),
      serviceCategories,
      otherCategoryDetail: sanitizeText(otherCategoryDetail),
      serviceAreas,
      yearsExperience,
      languages: sanitizeText(languages),
      verificationNotes: sanitizeText(verificationNotes),
      verificationDocuments
    }
  })
}
