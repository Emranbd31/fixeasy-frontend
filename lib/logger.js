export function logSecurityEvent(event, payload = {}) {
  const entry = { event, payload, timestamp: new Date().toISOString() }
  if (process.env.NODE_ENV !== 'production') {
    console.info('[security-event]', entry)
  }
  return entry
}
