import { NextResponse } from 'next/server';
import { createSupabaseServerServiceRoleClient } from '@/lib/supabaseClient';

function logSupabaseEnvPresenceOnce(scope: string) {
    if (process.env.NODE_ENV === 'production') return;
    const g = globalThis as any;
    const flag = `__supabase_env_logged__${scope}`;
    if (g[flag]) return;
    g[flag] = true;

    const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    // eslint-disable-next-line no-console
    console.log(`[env-check:${scope}]`, { hasUrl, hasAnon, hasServiceRole });
}

function logSupabaseClientChoiceOnce(scope: string, info: { usesServiceRoleClient: boolean }) {
    if (process.env.NODE_ENV === 'production') return;
    const g = globalThis as any;
    const flag = `__supabase_client_choice_logged__${scope}`;
    if (g[flag]) return;
    g[flag] = true;

    const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    // eslint-disable-next-line no-console
    console.log(`[sb-choice:${scope}]`, {
        hasUrl,
        hasAnon,
        hasServiceRole,
        usesServiceRoleClient: info.usesServiceRoleClient,
    });
}

export async function POST(req: Request) {
    try {
        logSupabaseEnvPresenceOnce('api/register/professional:POST');
        const body = await req.json();
        const {
            user_id,
            name,
            email,
            phone,
            category,
            experience,
            rate,
            service_area,
            id_document,
            address_proof,
            qualification_file,
            insurance_file,
            portfolio_files,
            profile_photo,
        } = body || {};

        if (!user_id || !name || !email || !phone || !category || !id_document || !profile_photo) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = createSupabaseServerServiceRoleClient() as any; // widen types to avoid TS table typing errors
        logSupabaseClientChoiceOnce('api/register/professional:POST:before-upsert', { usesServiceRoleClient: true });

        // Upsert professional profile
        const { error } = await supabase
            .from('professionals')
            .upsert({
                user_id,
                name,
                email,
                phone,
                category,
                experience,
                rate,
                service_area,
                id_document,
                address_proof,
                qualification_file,
                insurance_file,
                portfolio_files,
                profile_photo,
                verified: false,
                role: 'professional',
            }, { onConflict: 'user_id' });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
    }
}
