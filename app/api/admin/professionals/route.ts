import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

function checkSecret(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  const provided = req.headers.get('x-admin-secret') || '';
  return secret && provided && secret === provided;
}

export async function GET(req: Request) {
  try {
    if (!checkSecret(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const supabase = createSupabaseServerClient() as any;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    let q = supabase.from('professionals').select('*').order('created_at', { ascending: false }).limit(100);
    if (status === 'pending') q = q.eq('verified', false);
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json({ rows: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
