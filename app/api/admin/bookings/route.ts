import { NextRequest, NextResponse } from 'next/server'
import { fetchAdminBackend } from '@/lib/api-client'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const backendPath = `/admin/bookings${url.search}`
    const result = await fetchAdminBackend(backendPath, { method: 'GET' }, req)
    if (!result.ok) {
      const body = result.data ?? { error: 'Backend error' }
      const payload = typeof body === 'object' ? body : { error: String(body ?? '') }
      return NextResponse.json(payload, { status: result.status })
    }
    const safePayload = result.data ?? { bookings: [] }
    return NextResponse.json(safePayload, { status: result.status })
  } catch (e) {
    console.error('[admin bookings] proxy failed', e)
    return NextResponse.json({ error: 'Unable to reach backend' }, { status: 502 })
  }
}
