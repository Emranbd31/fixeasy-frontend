import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerServiceRoleClient } from '@/lib/supabaseClient'
import { requireAdminSecret } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  try {
    const guard = requireAdminSecret(req)
    if (guard) return NextResponse.json(guard, { status: 401 })

    const url = new URL(req.url)
    const status = url.searchParams.get('status')?.trim() || null
    const assigned = url.searchParams.get('assigned')?.trim() || null
    const unassigned = url.searchParams.get('unassigned')?.trim() || null
    const acceptedBy = url.searchParams.get('accepted_by')?.trim() || null
    const limitRaw = url.searchParams.get('limit')?.trim() || null
    const limit = limitRaw ? Math.min(Math.max(Number(limitRaw) || 0, 1), 500) : 200

    const supabase = createSupabaseServerServiceRoleClient()
    let query = (supabase as any)
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) query = query.eq('status', status)
    if (acceptedBy) query = query.eq('accepted_by', acceptedBy)

    const truthy = new Set(['1', 'true', 'yes'])
    if (assigned && truthy.has(assigned.toLowerCase())) query = query.not('accepted_by', 'is', null)
    if (unassigned && truthy.has(unassigned.toLowerCase())) query = query.is('accepted_by', null)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ bookings: data ?? [] })
  } catch (e) {
    console.error('[admin bookings] failed', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
