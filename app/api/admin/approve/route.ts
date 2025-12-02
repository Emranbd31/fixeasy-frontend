import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

const supabase = createSupabaseServerClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { proId } = body;
    if (!proId) return NextResponse.json({ error: 'Missing proId' }, { status: 400 });

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
