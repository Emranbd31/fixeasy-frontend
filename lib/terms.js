import { TERMS } from '../data/terms'
import { getStore, addAuditLog } from './memory-store'

export function getLatestTerms() {
  return TERMS[TERMS.length - 1]
}

export function recordAcceptance({ userId, accountType, version, ipAddress, userAgent }) {
  const store = getStore()
  const entry = {
    userId,
    accountType,
    version,
    ipAddress,
    userAgent,
    acceptedAt: new Date().toISOString()
  }
  store.termsAcceptances.push(entry)
  addAuditLog({
    event: 'terms.accepted',
    userId,
    accountType,
    version,
    ipAddress,
    userAgent
  })
  return entry
}
