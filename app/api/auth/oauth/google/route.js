import { NextResponse } from 'next/server'
import { createToken } from '../../../../../lib/tokens'

export const dynamic = 'force-dynamic'

export async function POST() {
  const state = createToken({ provider: 'google', purpose: 'oauth' })
  return NextResponse.json({ ok: true, redirectUrl: `https://accounts.google.com/o/oauth2/auth?state=${state}` })
}
