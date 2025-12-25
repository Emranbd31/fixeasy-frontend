import { NextResponse } from 'next/server';
import { createSupabaseServerServiceRoleClient } from '@/lib/supabaseClient';
import { requireAdminSecret } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const guard = requireAdminSecret(request);
    if (guard) return NextResponse.json(guard, { status: 401 });

    const body = await request.json();
    const { proId } = body;
    if (!proId) return NextResponse.json({ error: 'Missing proId' }, { status: 400 });

    const supabase = createSupabaseServerServiceRoleClient();
    const { error } = await (supabase as any)
      .from('professionals')
      .update({ status: 'approved' })
      .eq('id', proId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
