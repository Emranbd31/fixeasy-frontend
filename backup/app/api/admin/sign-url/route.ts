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
        const { path } = await req.json();
        if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 });
        const supabase = createSupabaseServerClient() as any;
        const { data, error } = await supabase.storage.from('pro-uploads').createSignedUrl(path, 60);
        if (error) throw error;
        return NextResponse.json({ url: data?.signedUrl });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
    }
}
