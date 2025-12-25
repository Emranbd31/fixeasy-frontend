import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerServiceRoleClient } from '@/lib/supabaseClient'
import { requireAdminSecret } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  try {
    const guard = requireAdminSecret(req)
    if (guard) return NextResponse.json(guard, { status: 401 })

    const url = new URL(req.url)
    const status = url.searchParams.get('status')?.trim() || null
    const limitRaw = url.searchParams.get('limit')?.trim() || null
    const limit = limitRaw ? Math.min(Math.max(Number(limitRaw) || 0, 1), 500) : 200

    const supabase = createSupabaseServerServiceRoleClient()
    let query = (supabase as any)
      .from('professionals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ professionals: data ?? [] })
  } catch (e) {
    console.error('[admin professionals] failed', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
