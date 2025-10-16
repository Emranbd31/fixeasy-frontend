import { NextResponse } from 'next/server'
import { recordAcceptance } from '../../../../lib/terms'
import { sanitizeText } from '../../../../lib/validation'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const body = await request.json()
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'
  const { userId, accountType, version } = body ?? {}

  if (!userId || !accountType || !version) {
    return NextResponse.json({ ok: false, message: 'userId, accountType, and version are required.' }, { status: 400 })
  }

  const entry = recordAcceptance({
    userId: sanitizeText(userId),
    accountType: sanitizeText(accountType),
    version: sanitizeText(version),
    ipAddress,
    userAgent
  })

  return NextResponse.json({ ok: true, entry })
}
