import { NextResponse } from 'next/server'
import { createToken } from '../../../../../lib/tokens'

export const dynamic = 'force-dynamic'

export async function POST() {
  const state = createToken({ provider: 'apple', purpose: 'oauth' })
  return NextResponse.json({ ok: true, redirectUrl: `https://appleid.apple.com/auth/authorize?state=${state}` })
}
