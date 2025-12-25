import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const hasNonEmpty = (value: string | undefined) => Boolean(value && value.trim().length > 0);

export async function GET() {
  const hasUrl = hasNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnon = hasNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || hasNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_KEY);
  const hasServiceRole = hasNonEmpty(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return NextResponse.json(
    {
      ok: true,
      env: {
        hasUrl,
        hasAnon,
        hasServiceRole,
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
