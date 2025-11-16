import { NextResponse } from 'next/server';

// Use the admin backend URL from environment (admin-specific variable)
const BACKEND_URL = (process.env.NEXT_PUBLIC_ADMIN_BASE_URL || 'https://api.fixeasy.irish').replace(/\/$/, '');
const BACKEND_LOGIN_URL = `${BACKEND_URL}/admin/login`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    let res: Response | null = null;
    try {
      res = await fetch(BACKEND_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      console.error('[admin login] backend fetch failed', err);
      return NextResponse.json({ error: 'Backend unavailable' }, { status: 502 });
    }

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

    // Set cookie (HttpOnly, Secure, SameSite=Lax). Max-Age 7 days (604800 seconds).
    const maxAge = 7 * 24 * 60 * 60; // 604800
    // In production we set the cookie Domain to the admin subdomain so it is shared correctly.
    // For local development we must NOT set Domain (so tests on localhost work).
    const domainPart = process.env.NODE_ENV === 'production' ? ' Domain=admin.fixeasy.irish;' : '';
    const cookie = `fixeasy_admin_token=${token}; Path=/;${domainPart} HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

    return NextResponse.json({ ok: true }, { headers: { 'Set-Cookie': cookie } });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
