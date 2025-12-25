import { NextResponse } from 'next/server';
import { getAnyEnvTrimmed, getEnvTrimmed } from '@/lib/env';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const hasNonEmpty = (value: string | undefined) => Boolean(value && value.trim().length > 0);

export async function GET() {
  const hasUrl = hasNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnon = hasNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || hasNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_KEY);
  const hasServiceRole = hasNonEmpty(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const hasApiBase = Boolean(
    getAnyEnvTrimmed(['NEXT_PUBLIC_API_BASE', 'NEXT_PUBLIC_API_URL', 'API_BASE_URL', 'BACKEND_URL'])
  );
  const hasStripeSecret = Boolean(getEnvTrimmed('STRIPE_SECRET_KEY'));
  const hasAdminSecret = Boolean(getEnvTrimmed('ADMIN_SECRET'));

  return NextResponse.json(
    {
      ok: true,
      env: {
        hasUrl,
        hasAnon,
        hasServiceRole,
        hasApiBase,
        hasStripeSecret,
        hasAdminSecret,
      },
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
