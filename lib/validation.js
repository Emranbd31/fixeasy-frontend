const IRISH_PHONE_REGEX = /^\+?353\d{8,9}$/
const EIRCODE_REGEX = /^[A-Z]{1,2}\d{2}\s?[A-Z0-9]{4}$/i
const COMPANY_REG_REGEX = /^\d{6,7}$|^[A-Z]{1,2}\d{6}$/i
const PPS_NUMBER_REGEX = /^[0-9]{7}[A-W][A-IW]?$/i

export function isValidIrishPhone(phone) {
  if (!phone) return false
  const normalized = phone.replace(/\s+/g, '')
  return IRISH_PHONE_REGEX.test(normalized)
}

export function isValidEircode(eircode) {
  if (!eircode) return false
  return EIRCODE_REGEX.test(eircode.trim())
}

export function isValidIrishCompanyNumber(value) {
  if (!value) return false
  return COMPANY_REG_REGEX.test(value.trim())
}

export function isValidPpsNumber(value) {
  if (!value) return false
  return PPS_NUMBER_REGEX.test(value.trim())
}

export function sanitizeText(value) {
  return value?.trim().replace(/\s{2,}/g, ' ') ?? ''
}

export function sanitizePhone(value) {
  if (!value) return ''
  return value.replace(/[^+\d]/g, '')
}
