import { NextResponse } from 'next/server';

// Resolve backend login URL in this order:
// 1. `BACKEND_URL` (server env)
// 2. `NEXT_PUBLIC_API_URL` (public env)
// 3. fallback to the known working Vercel deployment URL
const resolvedBase =
  process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ??
  'https://backend-main-4g38ypsmw-emrans-projects-8d06d556.vercel.app';

const BACKEND_LOGIN_URL = `${resolvedBase.replace(/\/$/, '')}/admin/login`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const res = await fetch(BACKEND_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // If backend returned an error, forward useful details for debugging.
    if (!res.ok) {
      let backendBody: any = null;
      try {
        backendBody = await res.json().catch(() => null);
      } catch (_) {
        backendBody = await res.text().catch(() => null);
      }
      const message =
        backendBody?.error ?? backendBody?.message ?? String(backendBody) ?? `Backend responded ${res.status}`;
      console.error('[admin login] backend error', res.status, message);
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const data = await res.json();
    // Expecting backend to return { token: '...' } or similar
    const token = data?.token ?? data?.accessToken ?? null;
    if (!token) {
      console.error('[admin login] backend returned no token', data);
      return NextResponse.json({ error: 'Backend did not return a token' }, { status: 502 });
    }

    // Set cookie (HttpOnly, Secure, SameSite=Lax). Max-Age 7 days.
    const maxAge = 7 * 24 * 60 * 60;
    const cookie = `fixeasy_admin_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

    return NextResponse.json({ ok: true }, { headers: { 'Set-Cookie': cookie } });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
