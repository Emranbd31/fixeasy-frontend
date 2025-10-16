import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getStore } from '../../../../lib/memory-store'
import { sanitizeText } from '../../../../lib/validation'
import { createToken } from '../../../../lib/tokens'

export const dynamic = 'force-dynamic'

function hashSecret(secret) {
  return crypto.createHash('sha256').update(secret).digest('hex')
}

export async function POST(request) {
  const { email, password } = await request.json()
  const store = getStore()
  const normalizedEmail = sanitizeText(email).toLowerCase()
  const passwordHash = hashSecret(password || '')

  const user = [...store.users, ...store.professionals].find((entry) => entry.email === normalizedEmail)
  if (!user || user.passwordHash !== passwordHash) {
    return NextResponse.json({ ok: false, message: 'Invalid credentials.' }, { status: 401 })
  }

  const accessToken = createToken({ sub: user.id, role: user.role })
  const refreshToken = createToken({ sub: user.id, role: user.role, type: 'refresh' }, 60 * 60 * 24 * 30)

  return NextResponse.json({
    ok: true,
    accessToken,
    refreshToken,
    termsVersion: user.termsVersion,
    requiresTermsReaccept: false
  })
}
