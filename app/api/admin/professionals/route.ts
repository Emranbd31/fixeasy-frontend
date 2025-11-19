import { NextRequest, NextResponse } from 'next/server'
import { fetchAdminBackend } from '../../../../lib/apiClient'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const backendPath = `/admin/professionals${url.search}`
    const result = await fetchAdminBackend(backendPath, { method: 'GET' }, req)
    if (!result.ok) {
      const body = result.data ?? { error: 'Backend error' }
      const payload = typeof body === 'object' ? body : { error: String(body ?? '') }
      return NextResponse.json(payload, { status: result.status })
    }
    return NextResponse.json(result.data ?? {}, { status: result.status })
  } catch (e) {
    console.error('[admin professionals] proxy failed', e)
    return NextResponse.json({ error: 'Unable to reach backend' }, { status: 502 })
  }
}
