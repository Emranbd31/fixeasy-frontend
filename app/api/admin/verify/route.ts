/**
 * JWT verification endpoint for FixEasy Admin.
 *
 * Visit /api/admin/verify in a browser or use fetch() to check token validity.
 * Example:
 *   fetch('/api/admin/verify', { headers: { Authorization: 'Bearer <token>' } }).then(r => r.json())
 * or rely on the cookie `fixeasy_admin_token` being sent by the browser.
 */
import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const DEFAULT_JWT_SECRET = 'fixeasy-default-secret-change-me';

function getTokenFromRequest(request: NextRequest) {
  // 1) cookie named fixeasy_admin_token
  const cookieToken = request.cookies.get('fixeasy_admin_token')?.value;
  if (cookieToken) return cookieToken;

  // 2) Authorization header: Bearer <token>
  const auth = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') return parts[1];
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ valid: false, message: 'Missing token' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
    let payload: any = null;
    try {
      payload = jwt.verify(token, secret);
    } catch (e: any) {
      return NextResponse.json({ valid: false, message: `Invalid token: ${e?.message || 'unauthorized'}` }, { status: 401 });
    }

    // Extract user and role fields from payload
    const user = (payload && (payload.sub || payload.user || payload.email || payload.name)) || null;
    const role = (payload && (payload.role || payload.roles || payload.roles?.[0])) || null;

    // Normalize role check
    const isAdmin = (() => {
      if (!role) return false;
      if (Array.isArray(role)) return role.includes('admin');
      if (typeof role === 'string') return role === 'admin' || role.split(',').map((r: string) => r.trim()).includes('admin');
      return false;
    })();

    if (!isAdmin) {
      return NextResponse.json({ valid: false, user, role, message: 'Forbidden: admin role required' }, { status: 403 });
    }

    return NextResponse.json({ valid: true, user, role, message: 'Token valid' });
  } catch (err: any) {
    // Unexpected errors
    return NextResponse.json({ valid: false, message: `Error verifying token: ${err?.message || String(err)}` }, { status: 500 });
  }
}

// Also allow POST for clients that want to send token in body (optional)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const tokenFromBody = body?.token;
    if (tokenFromBody) {
      // emulate a request with a cookie for verification reuse
      const fakeReq = request;
      // temporarily verify using the same logic
      const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
      try {
        const payload = jwt.verify(tokenFromBody, secret) as any;
        const user = (payload && (payload.sub || payload.user || payload.email || payload.name)) || null;
        const role = (payload && (payload.role || payload.roles || payload.roles?.[0])) || null;
        const isAdmin = Array.isArray(role) ? role.includes('admin') : (typeof role === 'string' ? (role === 'admin' || role.split(',').map((r: string) => r.trim()).includes('admin')) : false);
        if (!isAdmin) return NextResponse.json({ valid: false, user, role, message: 'Forbidden: admin role required' }, { status: 403 });
        return NextResponse.json({ valid: true, user, role, message: 'Token valid' });
      } catch (e: any) {
        return NextResponse.json({ valid: false, message: `Invalid token: ${e?.message || 'unauthorized'}` }, { status: 401 });
      }
    }

    // Fallback to GET-style verification (cookie or Authorization header)
    return GET(request);
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: `Error verifying token: ${err?.message || String(err)}` }, { status: 500 });
  }
}
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
        const body = await req.json();
        const { user_id, verified } = body || {};
        if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 });
        const supabase = createSupabaseServerClient() as any;
        const { error } = await supabase.from('professionals').update({ verified: !!verified }).eq('user_id', user_id);
        if (error) throw error;
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
    }
}
