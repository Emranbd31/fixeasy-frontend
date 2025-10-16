import path from 'path'
import { promises as fs } from 'fs'
import { sanitizeText } from './validation'

function resolveAuditPath() {
  if (process.env.TERMS_ACCEPTANCE_LOG_PATH) {
    return process.env.TERMS_ACCEPTANCE_LOG_PATH
  }

  const baseDir = process.env.VERCEL === '1' ? '/tmp' : path.join(process.cwd(), 'data')
  return path.join(baseDir, 'terms-acceptance-log.jsonl')
}

const ACCEPTANCE_LOG_PATH = resolveAuditPath()

export function extractClientIp(req) {
  const forwarded = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress ?? ''
}

export function validateTermsAcceptance(payload, latestTerms) {
  const version = sanitizeText(payload.termsVersion)
  if (!version) {
    return {
      ok: false,
      error: 'Accept the latest Terms & Conditions to continue.',
      field: 'acceptTerms'
    }
  }

  if (version !== latestTerms.version) {
    return {
      ok: false,
      error: `Terms & Conditions version mismatch. Expected ${latestTerms.version}.`,
      field: 'acceptTerms'
    }
  }

  if (!payload.termsAcceptedAt) {
    return {
      ok: false,
      error: 'Missing Terms & Conditions acceptance timestamp.',
      field: 'acceptTerms'
    }
  }

  if (Number.isNaN(Date.parse(payload.termsAcceptedAt))) {
    return {
      ok: false,
      error: 'Provide a valid Terms acceptance timestamp.',
      field: 'acceptTerms'
    }
  }

  return { ok: true }
}

export async function recordTermsAcceptance({ accountType, payload, req, reference }) {
  if (!payload.termsVersion) return

  const entry = {
    accountType,
    reference,
    email: payload.email,
    termsVersion: payload.termsVersion,
    termsAcceptedAt: payload.termsAcceptedAt,
    confirmAccuracy: Boolean(payload.confirmAccuracy),
    marketingConsent: Boolean(payload.marketingConsent),
    acceptedIp: extractClientIp(req),
    userAgent: sanitizeText(req.headers['user-agent'] ?? ''),
    recordedAt: new Date().toISOString()
  }

  try {
    await fs.mkdir(path.dirname(ACCEPTANCE_LOG_PATH), { recursive: true })
    await fs.appendFile(ACCEPTANCE_LOG_PATH, `${JSON.stringify(entry)}\n`, 'utf8')
  } catch (error) {
    console.error('Unable to record terms acceptance audit entry', error)
  }
}

export function getAcceptanceLogPath() {
  return ACCEPTANCE_LOG_PATH
}
