import { isValidIrishPhone, sanitizePhone, sanitizeText } from '../../../lib/validation'

function error(message, field) {
  return { ok: false, error: message, field }
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json(error('Method not allowed.'))
  }

  const {
    fullName,
    email,
    phone,
    address,
 codex/implement-v5-update-plan-for-fixeasy-o20fcx
    serviceType,
    otherServiceDescription,
    issueDetails,
    issuePhoto,
    issuePhotoUrl
  } = req.body ?? {}

  const normalizedFullName = sanitizeText(fullName)
  const normalizedEmail = sanitizeText(email).toLowerCase()
  const normalizedAddress = sanitizeText(address)
  const normalizedServiceType = sanitizeText(serviceType)
  const normalizedOtherDescription = sanitizeText(otherServiceDescription)
  const normalizedIssueDetails = sanitizeText(issueDetails)
  const normalizedIssuePhotoUrl = sanitizeText(issuePhotoUrl)

  if (!normalizedFullName) {
    return res.status(400).json(error('Enter your full name.', 'fullName'))
  }

  if (!normalizedEmail || !/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(normalizedEmail)) {

    password,
    serviceType,
    otherServiceDescription,
    problemDetails,
    issuePhoto,
    issuePhotoUrl,
    acceptTerms
  } = req.body ?? {}

  if (!sanitizeText(fullName)) {
    return res.status(400).json(error('Enter your full name.', 'fullName'))
  }

  if (!sanitizeText(email) || !/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(email)) {
 main
    return res.status(400).json(error('Provide a valid contact email.', 'email'))
  }

  if (!isValidIrishPhone(phone)) {
    return res.status(400).json(error('Use an Irish contact number in +353 format.', 'phone'))
  }

 codex/implement-v5-update-plan-for-fixeasy-o20fcx
  if (!normalizedAddress) {
    return res.status(400).json(error('Include an address or Eircode so we can route the job.', 'address'))
  }

  if (!normalizedServiceType) {
    return res.status(400).json(error('Select the service you need support with.', 'serviceType'))
  }

  if (serviceType === 'Other (please specify)' && !normalizedOtherDescription) {
    return res.status(400).json(error('Describe the service or expertise you require.', 'otherServiceDescription'))
  }

  if (!normalizedIssueDetails || normalizedIssueDetails.length < 20) {
    return res.status(400).json(error('Describe the issue so we can triage correctly.', 'issueDetails'))
    
  if (!sanitizeText(address)) {
    return res.status(400).json(error('Include an address or Eircode so we can route the job.', 'address'))
  }

  if (!sanitizeText(serviceType)) {
    return res.status(400).json(error('Select the service you need support with.', 'serviceType'))
  }

  if (
    serviceType === 'Other (please specify)' &&
    !sanitizeText(otherServiceDescription)
  ) {
    return res.status(400).json(error('Describe the service or expertise you require.', 'otherServiceDescription'))
  }

  if (!sanitizeText(problemDetails) || sanitizeText(problemDetails).length < 20) {
    return res.status(400).json(error('Describe the issue so we can triage correctly.', 'problemDetails'))
  }

  if (!sanitizeText(password) || password.length < 8) {
    return res.status(400).json(error('Create a secure password of at least 8 characters.', 'password'))
  }

  if (!acceptTerms) {
    return res.status(400).json(error('You must agree to the FixEasy terms to continue.', 'acceptTerms'))
 main
  }

  const reference = `CL-${Date.now().toString(36).toUpperCase()}`

 codex/implement-v5-update-plan-for-fixeasy-o20fcx
  const responsePayload = {
    ok: true,
    reference,
    receivedAt: new Date().toISOString(),
    serviceType: normalizedServiceType,
    otherServiceDescription: normalizedOtherDescription,
    issueDetails: normalizedIssueDetails,
    issuePhoto,
    issuePhotoUrl: normalizedIssuePhotoUrl,
    phone: sanitizePhone(phone),
    normalized: {
      fullName: normalizedFullName,
      email: normalizedEmail,
      address: normalizedAddress
    }
  }

  return res.status(200).json(responsePayload)
=======
  return res.status(200).json({
    ok: true,
    reference,
    receivedAt: new Date().toISOString(),
    serviceType: sanitizeText(serviceType),
    otherServiceDescription: sanitizeText(otherServiceDescription),
    problemDetails: sanitizeText(problemDetails),
    issuePhoto,
    issuePhotoUrl: issuePhotoUrl || '',
    phone: sanitizePhone(phone)
  })
 main
}
