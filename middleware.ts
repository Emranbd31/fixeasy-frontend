import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/supabase.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase environment variables are not configured.');
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
                autoRefreshToken: false,
                persistSession: false,
        },
});

export async function middleware(req: NextRequest) {
        const { pathname } = req.nextUrl;
        if (!pathname.startsWith('/super-admin')) {
                return NextResponse.next();
        }

        const accessToken = req.cookies.get('sb-access-token')?.value;
        if (!accessToken) {
                const loginUrl = req.nextUrl.clone();
                loginUrl.pathname = '/login';
                return NextResponse.redirect(loginUrl);
        }

        const {
                data: { user },
                error: userError,
        } = await supabase.auth.getUser(accessToken);

        if (userError || !user) {
                const loginUrl = req.nextUrl.clone();
                loginUrl.pathname = '/login';
                return NextResponse.redirect(loginUrl);
        }

        const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();

        if (profileError || !profile || profile.role !== 'admin') {
                const forbiddenUrl = req.nextUrl.clone();
                forbiddenUrl.pathname = '/403';
                return NextResponse.redirect(forbiddenUrl);
        }

        return NextResponse.next();
}

export const config = {
        matcher: ['/super-admin/:path*'],
};
