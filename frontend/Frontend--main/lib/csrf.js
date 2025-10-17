import { randomBytes } from 'crypto'

export const CSRF_COOKIE_NAME = 'fixeasy.csrf'
export const CSRF_HEADER_NAME = 'x-csrf-token'

function appendCookie(res, cookie) {
  const current = res.getHeader('Set-Cookie')
  if (!current) {
    res.setHeader('Set-Cookie', cookie)
    return
  }
  if (Array.isArray(current)) {
    res.setHeader('Set-Cookie', [...current, cookie])
    return
  }
  res.setHeader('Set-Cookie', [current, cookie])
}

export function ensureCsrfCookie(ctx) {
  const existing = ctx.req.cookies?.[CSRF_COOKIE_NAME]
  if (existing) {
    return existing
  }

  const token = randomBytes(32).toString('hex')
  const secure = process.env.NODE_ENV === 'production'
  const cookie = `${CSRF_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600${secure ? '; Secure' : ''}`
  appendCookie(ctx.res, cookie)
  return token
}

export function verifyCsrfToken(req) {
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME]
  const headerToken = req.headers[CSRF_HEADER_NAME]
  return Boolean(cookieToken && headerToken && cookieToken === headerToken)
}
