import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

function checkSecret(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  const provided = req.headers.get('x-admin-secret') || '';
  return secret && provided && secret === provided;
}

export async function POST(req: Request) {
  try {
    if (!checkSecret(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { user_id, verified } = body || {};
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 });
    const supabase = createSupabaseServerClient() as any;
    const { error } = await supabase.from('professionals').update({ verified: !!verified }).eq('user_id', user_id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
