import crypto from 'crypto'

const SECRET = process.env.JWT_SECRET || 'local-development-secret'

export function createToken(payload, ttlSeconds = 900) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url')
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64url')
  return `${header}.${body}.${signature}`
}

export function verifyToken(token) {
  if (!token) return null
  const [header, body, signature] = token.split('.')
  if (!header || !body || !signature) return null
  const expected = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url')
  if (expected !== signature) return null
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return null
  }
  return payload
}

export function rotateRefreshToken(token) {
  const payload = verifyToken(token)
  if (!payload) return null
  const { exp, iat, ...rest } = payload
  return createToken(rest, 60 * 60 * 24 * 30)
}
