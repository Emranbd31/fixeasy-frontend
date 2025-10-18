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
 codex/implement-v5-update-plan-for-fixeasy-o20fcx
    consent,
    verificationDocuments
  } = req.body ?? {}

  const normalizedFullName = sanitizeText(fullName)
  const normalizedEmail = sanitizeText(email).toLowerCase()
  const normalizedOtherCategory = sanitizeText(otherCategoryDetail)

  if (!normalizedFullName) {
    return res.status(400).json(error('Enter your full name or business name.', 'fullName'))
  }

  if (!normalizedEmail || !/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(normalizedEmail)) {

    yearsExperience,
    languages,
    verificationNotes,
    verificationDocuments
  } = req.body ?? {}

  if (!sanitizeText(fullName)) {
    return res.status(400).json(error('Enter your full name or business name.', 'fullName'))
  }

  if (!sanitizeText(email) || !/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(email)) {
 main
    return res.status(400).json(error('Provide a valid contact email.', 'email'))
  }

  if (!isValidIrishPhone(phone)) {
    return res.status(400).json(error('Use an Irish phone number in +353 format.', 'phone'))
  }

  if (!Array.isArray(serviceCategories) || serviceCategories.length === 0) {
    return res.status(400).json(error('Select at least one service category.', 'serviceCategories'))
  }

 codex/implement-v5-update-plan-for-fixeasy-o20fcx
  if (serviceCategories.includes('Other (please specify)') && !normalizedOtherCategory) {

  if (
    serviceCategories.includes('Other (please specify)') &&
    !sanitizeText(otherCategoryDetail)
  ) {
main
    return res.status(400).json(error('Describe the additional service you offer.', 'otherCategoryDetail'))
  }

  if (!Array.isArray(serviceAreas) || serviceAreas.length === 0) {
    return res.status(400).json(error('Select at least one service area.', 'serviceAreas'))
  }

codex/implement-v5-update-plan-for-fixeasy-o20fcx
  if (!verificationDocuments || typeof verificationDocuments !== 'object') {
    return res.status(400).json(error('Upload verification documents.', 'verificationDocuments'))
  }

  if (!sanitizeText(verificationDocuments.photo_id_url)) {
    return res.status(400).json(error('Photo ID is required.', 'verificationDocuments.photo_id_url'))
  }

  if (!sanitizeText(verificationDocuments.selfie_url)) {
    return res.status(400).json(error('Selfie verification is required.', 'verificationDocuments.selfie_url'))
  }

  if (!consent) {
    return res.status(400).json(error('Confirm authenticity of the supplied documents.', 'consent'))

  if (typeof yearsExperience !== 'number' || Number.isNaN(yearsExperience) || yearsExperience < 0) {
    return res.status(400).json(error('Provide your years of experience.', 'yearsExperience'))
  }

  if (!verificationDocuments || typeof verificationDocuments !== 'object') {
    return res.status(400).json(error('Upload verification documents.', 'verificationDocuments'))
 main
  }

  const reference = `PRO-${Date.now().toString(36).toUpperCase()}`

  return res.status(200).json({
    ok: true,
    reference,
    receivedAt: new Date().toISOString(),
    normalized: {
codex/implement-v5-update-plan-for-fixeasy-o20fcx
      fullName: normalizedFullName,
      email: normalizedEmail,
      phone: sanitizePhone(phone),
      serviceCategories,
      otherCategoryDetail: normalizedOtherCategory,
      serviceAreas,
      consent: Boolean(consent),
      verificationDocuments: {
        photo_id_url: sanitizeText(verificationDocuments.photo_id_url),
        selfie_url: sanitizeText(verificationDocuments.selfie_url),
        insurance_url: sanitizeText(verificationDocuments.insurance_url)
      }
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
 main
    }
  })
}
