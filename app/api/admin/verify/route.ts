import { NextResponse } from 'next/server';
import { createSupabaseServerServiceRoleClient } from '@/lib/supabaseClient';
import { getEnvTrimmed } from '@/lib/env';

function checkSecret(req: Request) {
    const secret = getEnvTrimmed('ADMIN_SECRET');
    const provided = req.headers.get('x-admin-secret')?.trim() || '';
    return Boolean(secret && provided && secret === provided);
}

export async function POST(req: Request) {
    try {
        if (!checkSecret(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const body = await req.json();
        const { user_id, verified } = body || {};
        if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 });
        const supabase = createSupabaseServerServiceRoleClient() as any;
        const { error } = await supabase.from('professionals').update({ verified: !!verified }).eq('user_id', user_id);
        if (error) throw error;
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
    }
}
