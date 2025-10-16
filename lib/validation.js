export function sanitizeText(value = '') {
  return String(value ?? '').trim()
}

export function sanitizePhone(value = '') {
  return sanitizeText(value).replace(/\s+/g, '')
}

export function isValidIrishPhone(value) {
  const phone = sanitizePhone(value)
  return /^\+353\d{7,9}$/.test(phone)
}

export function isValidEircode(value) {
  const eircode = sanitizeText(value).toUpperCase()
  return /^[AC-FHKNPRTV-Y]\d{2}\s?[0-9AC-FHKNPRTV-Y]{4}$/.test(eircode)
}

export function isValidPpsNumber(value) {
  const cleaned = sanitizeText(value).toUpperCase()
  return /^\d{7}[A-W][A-I]?$/.test(cleaned)
}

export function isValidCompanyNumber(value) {
  return /^[0-9A-Z]{6,8}$/.test(sanitizeText(value).toUpperCase())
}

export function assert(condition, message, field) {
  if (!condition) {
    const error = new Error(message)
    error.field = field
    throw error
  }
}
