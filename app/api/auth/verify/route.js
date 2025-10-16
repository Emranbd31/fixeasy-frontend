import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/tokens'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const { token } = await request.json()
  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ ok: false, message: 'Token invalid or expired.' }, { status: 401 })
  }
  return NextResponse.json({ ok: true, payload })
}
