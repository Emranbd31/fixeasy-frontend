import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const getEnvTrimmed = (key: string) => {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : null;
};

const hostnameFromUrl = (url: string | null) => {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

const refFromHost = (host: string | null) => {
  if (!host) return null;
  const parts = host.split('.');
  if (parts.length < 3) return null;
  // Typical: <ref>.supabase.co (or <ref>.supabase.in)
  return parts[0] || null;
};

const prefix6 = (value: string | null) => (value ? value.slice(0, 6) : null);
const looksLikeJwt = (value: string | null) => Boolean(value && value.split('.').length === 3);

const redactBodySnippet = (text: string) => {
  const t = text.trim();
  if (!t) return '';
  // Only return a small snippet and remove anything that looks like a JWT.
  const noJwt = t.replace(/[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[REDACTED_JWT]');
  return noJwt.slice(0, 220);
};

async function probe(url: string, headers: Record<string, string>) {
  const timeoutMs = 9000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
      signal: controller.signal,
    });
    const bodyText = await res.text().catch(() => '');
    const snippet = redactBodySnippet(bodyText);
    const hasInvalidApiKey = /invalid api key/i.test(bodyText);
    return {
      ok: res.ok,
      status: res.status,
      hasInvalidApiKey,
      snippet,
    };
  } catch (error) {
    return {
      ok: false,
      status: null as number | null,
      hasInvalidApiKey: false,
      snippet: error instanceof Error ? error.message : 'Unknown error',
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: Request) {
  const expected = process.env.DIAG_SECRET?.trim();
  if (expected) {
    const provided = request.headers.get('x-diag-secret')?.trim();
    if (!provided || provided !== expected) {
      return NextResponse.json({ ok: false }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }
  }
  const supabaseUrl = getEnvTrimmed('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = getEnvTrimmed('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? getEnvTrimmed('NEXT_PUBLIC_SUPABASE_KEY');
  const serviceRoleKey = getEnvTrimmed('SUPABASE_SERVICE_ROLE_KEY');

  const urlHost = hostnameFromUrl(supabaseUrl);
  const supabaseRef = refFromHost(urlHost);

  const meta = {
    supabaseRef,
    urlHost,
    hasUrl: Boolean(supabaseUrl),
    hasAnon: Boolean(anonKey),
    hasServiceRole: Boolean(serviceRoleKey),
    anonLooksJwt: looksLikeJwt(anonKey),
    serviceRoleLooksJwt: looksLikeJwt(serviceRoleKey),
    anonKeyPrefix: prefix6(anonKey),
    serviceRoleKeyPrefix: prefix6(serviceRoleKey),
  };

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json(
      {
        ok: false,
        meta,
        error: 'Missing SUPABASE_URL or anon key in runtime env.',
        interpretation: {
          note: 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_KEY).',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const anonHeaders = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  };

  const serviceHeaders = serviceRoleKey
    ? {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      }
    : null;

  const base = supabaseUrl.replace(/\/$/, '');

  const results = {
    authHealth: await probe(`${base}/auth/v1/health`, { apikey: anonKey }),
    restRoot: await probe(`${base}/rest/v1/`, anonHeaders),
    bookingsAnonRead: await probe(`${base}/rest/v1/bookings?select=id&limit=1`, anonHeaders),
    bookingsServiceRoleRead: serviceHeaders
      ? await probe(`${base}/rest/v1/bookings?select=id&limit=1`, serviceHeaders)
      : { ok: false, status: null as number | null, hasInvalidApiKey: false, snippet: 'Missing SUPABASE_SERVICE_ROLE_KEY' },
    professionalsAnonRead: await probe(`${base}/rest/v1/professionals?select=id&limit=1`, anonHeaders),
    professionalsServiceRoleRead: serviceHeaders
      ? await probe(`${base}/rest/v1/professionals?select=id&limit=1`, serviceHeaders)
      : { ok: false, status: null as number | null, hasInvalidApiKey: false, snippet: 'Missing SUPABASE_SERVICE_ROLE_KEY' },
  };

  const interpretation = {
    keyUrlMismatchLikely:
      results.authHealth.status === 200 &&
      results.restRoot.status === 200 &&
      (results.bookingsAnonRead.hasInvalidApiKey || results.professionalsAnonRead.hasInvalidApiKey),
    rlsOrPermissionLikely:
      (results.bookingsAnonRead.status === 401 || results.bookingsAnonRead.status === 403) &&
      !results.bookingsAnonRead.hasInvalidApiKey,
    serviceRoleWorksButAnonBlocked:
      results.bookingsServiceRoleRead.status === 200 &&
      (results.bookingsAnonRead.status === 401 || results.bookingsAnonRead.status === 403) &&
      !results.bookingsAnonRead.ok,
    bothKeysInvalidLikely:
      (results.bookingsAnonRead.hasInvalidApiKey && results.bookingsServiceRoleRead.hasInvalidApiKey) ||
      (results.professionalsAnonRead.hasInvalidApiKey && results.professionalsServiceRoleRead.hasInvalidApiKey),
    note:
      'If health/rest root are 200 but table probes return Invalid API key, the URL/key pair likely points to different Supabase projects or keys were rotated.',
  };

  return NextResponse.json(
    {
      ok: true,
      meta,
      results,
      interpretation,
      timestamp: new Date().toISOString(),
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}
