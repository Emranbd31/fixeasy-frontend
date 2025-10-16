import { NextResponse } from 'next/server'
import { getLatestTerms } from '../../../../lib/terms'

export const dynamic = 'force-dynamic'

export async function GET() {
  const latest = getLatestTerms()
  return NextResponse.json({ ok: true, version: latest.version, publishedAt: latest.publishedAt, summary: latest.summary })
}
