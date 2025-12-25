import { NextResponse } from 'next/server';
import { createSupabaseServerServiceRoleClient } from '@/lib/supabaseClient';
import { requireAdminSecret } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const guard = requireAdminSecret(request);
    if (guard) return NextResponse.json(guard, { status: 401 });

    const body = await request.json();
    const { proId, user_id, userId } = body;
    const userIdValue = (user_id ?? userId) as string | undefined;
    if (!proId && !userIdValue) return NextResponse.json({ error: 'Missing proId or user_id' }, { status: 400 });

    const supabase = createSupabaseServerServiceRoleClient();

    let query = (supabase as any)
      .from('professionals')
      .update({ status: 'approved' });

    if (proId) query = query.eq('id', proId);
    if (!proId && userIdValue) query = query.eq('user_id', userIdValue);

    const { error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
