export const SESSION_COOKIE = 'fixeasy_admin_session'
export const SESSION_DURATION_SECONDS = 60 * 60 // 1 hour

export function encodeSession(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

export function decodeSession(value) {
  if (!value) return null
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
    if (!parsed || typeof parsed.email !== 'string') {
      return null
    }
    if (!parsed.email.toLowerCase().endsWith('@fixeasy.irish')) {
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

export function createSessionCookie(email) {
  const session = createSession(email)
  const cookieValue = encodeSession(session)
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
