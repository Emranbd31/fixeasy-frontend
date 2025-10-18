export const SESSION_COOKIE = 'fixeasy_admin_session'
export const SESSION_DURATION_SECONDS = 60 * 60 // 1 hour

const ADMIN_DOMAIN = '@fixeasy.irish'
const encoder = new TextEncoder()
const decoder = new TextDecoder()

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_DASHBOARD_SECRET || ''
}

function encodePayload(payload) {
  const jsonBytes = encoder.encode(JSON.stringify(payload))
  return toBase64Url(jsonBytes)
}

function decodePayload(encoded) {
  const bytes = fromBase64Url(encoded)
  return JSON.parse(decoder.decode(bytes))
}

function normalizeBase64(value) {
  return value.replace(/-/g, '+').replace(/_/g, '/').padEnd(value.length + ((4 - (value.length % 4)) % 4), '=')
}

function toBase64Url(bytes) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
  }

  let binary = ''
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  array.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value) {
  const base64 = normalizeBase64(value)
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'))
  }

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

async function getHmacKey(secret) {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    throw new Error('Web Crypto API is not available')
  }

  return subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify'
  ])
}

async function signPayload(encoded, secret) {
  const key = await getHmacKey(secret)
  const subtle = globalThis.crypto.subtle
  const signature = await subtle.sign('HMAC', key, encoder.encode(encoded))
  return toBase64Url(new Uint8Array(signature))
}

async function verifySignature(encoded, signature, secret) {
  try {
    const key = await getHmacKey(secret)
    const subtle = globalThis.crypto.subtle
    return subtle.verify('HMAC', key, fromBase64Url(signature), encoder.encode(encoded))
  } catch (error) {
    return false
  }
}

export function encodeSession(payload) {
  return encodePayload(payload)
}

export async function decodeSession(value) {
  if (!value || typeof value !== 'string') {
    return null
  }

  const [encoded, signature] = value.split('.')
  if (!encoded || !signature) {
    return null
  }

  const secret = getSessionSecret()
  if (!secret || !(await verifySignature(encoded, signature, secret))) {
    return null
  }

  try {
    const parsed = decodePayload(encoded)
    if (!parsed || typeof parsed.email !== 'string') {
      return null
    }

    if (!parsed.email.toLowerCase().endsWith(ADMIN_DOMAIN)) {
      return null
    }

    if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
      return null
    }

    return parsed
  } catch (error) {
    return null
  }
}

export function createSession(email) {
  const issuedAt = new Date()
  const expiresAt = new Date(issuedAt.getTime() + SESSION_DURATION_SECONDS * 1000)
  return {
    email: email.toLowerCase(),
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString()
  }
}

function serializeCookie(name, value, options = {}) {
  const segments = [`${name}=${value}`]
  const opts = {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    ...options
  }

  if (opts.maxAge !== undefined) {
    segments.push(`Max-Age=${Math.floor(opts.maxAge)}`)
  }

  if (opts.expires) {
    segments.push(`Expires=${opts.expires.toUTCString()}`)
  }

  if (opts.path) {
    segments.push(`Path=${opts.path}`)
  }

  if (opts.domain) {
    segments.push(`Domain=${opts.domain}`)
  }

  if (opts.secure) {
    segments.push('Secure')
  }

  if (opts.httpOnly) {
    segments.push('HttpOnly')
  }

  if (opts.sameSite) {
    const allowed = ['lax', 'strict', 'none']
    const sameSite = typeof opts.sameSite === 'string' ? opts.sameSite.toLowerCase() : ''
    if (allowed.includes(sameSite)) {
      segments.push(`SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`)
    }
  }

  return segments.join('; ')
}

export async function createSessionCookie(email) {
  const secret = getSessionSecret()
  if (!secret) {
    throw new Error('Admin session secrets are not configured')
  }

  const session = createSession(email)
  const encoded = encodeSession(session)
  const signature = await signPayload(encoded, secret)
  const cookieValue = `${encoded}.${signature}`
  const secure = process.env.NODE_ENV === 'production'
  return {
    session,
    header: serializeCookie(SESSION_COOKIE, cookieValue, {
      maxAge: SESSION_DURATION_SECONDS,
      expires: new Date(session.expiresAt),
      secure
    })
  }
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === 'production'
  return serializeCookie(SESSION_COOKIE, '', {
    maxAge: 0,
    expires: new Date(0),
    secure
  })
}
