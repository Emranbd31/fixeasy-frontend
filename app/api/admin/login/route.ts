import { NextResponse } from 'next/server';
import { getAnyEnvTrimmed } from '@/lib/env';

// Resolve backend base URL from env. Default to localhost in dev, production URL otherwise.
const BACKEND_URL = (
  getAnyEnvTrimmed(['NEXT_PUBLIC_API_BASE', 'NEXT_PUBLIC_API_URL', 'API_BASE_URL', 'BACKEND_URL']) ||
  (process.env.NODE_ENV === 'production' ? 'https://api.fixeasy.irish' : 'http://localhost:8000')
).replace(/\/$/, '');
const BACKEND_LOGIN_URL = `${BACKEND_URL}/admin/login`;

export async function POST(request: Request) {
  let body: any = null;
  try {
    body = await request.json();
  } catch (err) {
    const headers = Object.fromEntries(request.headers.entries());
    console.error('[admin login] invalid JSON payload', { err, headers });
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }

  try {
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
    console.error('[admin login] backend error', { status: res.status, backend: BACKEND_LOGIN_URL, message });
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const data = await res.json();
    // Expecting backend to return { token: '...' } or similar
    const token = data?.token ?? data?.accessToken ?? null;
    if (!token) {
      console.error('[admin login] backend returned no token', data);
      return NextResponse.json({ error: 'Backend did not return a token' }, { status: 502 });
    }

    // Set cookie (HttpOnly) dedicated for admin auth only.
    const maxAge = 7 * 24 * 60 * 60;
    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: 'fixeasy_admin_token',
      value: token,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/admin',
      maxAge,
    });

    return response;
  } catch (err) {
    console.error('[admin login] unexpected failure', err);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
