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
    serviceType,
    otherServiceDescription,
    issueDetails,
    issuePhoto,
    issuePhotoUrl
  } = req.body ?? {}

  if (!sanitizeText(fullName)) {
    return res.status(400).json(error('Enter your full name.', 'fullName'))
  }

  if (!sanitizeText(email) || !/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(email)) {
    return res.status(400).json(error('Provide a valid contact email.', 'email'))
  }

  if (!isValidIrishPhone(phone)) {
    return res.status(400).json(error('Use an Irish contact number in +353 format.', 'phone'))
  }

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

  if (!sanitizeText(issueDetails) || sanitizeText(issueDetails).length < 20) {
    return res.status(400).json(error('Describe the issue so we can triage correctly.', 'issueDetails'))
  }

  const reference = `CL-${Date.now().toString(36).toUpperCase()}`

  return res.status(200).json({
    ok: true,
    reference,
    receivedAt: new Date().toISOString(),
    serviceType: sanitizeText(serviceType),
    otherServiceDescription: sanitizeText(otherServiceDescription),
    issueDetails: sanitizeText(issueDetails),
    issuePhoto,
    issuePhotoUrl: issuePhotoUrl || '',
    phone: sanitizePhone(phone)
  })
}
