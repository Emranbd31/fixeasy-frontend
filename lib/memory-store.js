const globalStore = globalThis.__FIXEASY_MEMORY__ || {
  users: [],
  professionals: [],
  termsAcceptances: [],
  auditLogs: []
}

if (!globalThis.__FIXEASY_MEMORY__) {
  globalThis.__FIXEASY_MEMORY__ = globalStore
}

export function getStore() {
  return globalStore
}

export function addAuditLog(entry) {
  globalStore.auditLogs.push({ ...entry, recordedAt: new Date().toISOString() })
}
