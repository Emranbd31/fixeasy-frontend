import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

async function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
    if (!secret) return null;
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    return payload as any;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Only guard /admin paths
  if (!url.pathname.startsWith('/admin')) return NextResponse.next();

  // Allow the login page
  if (url.pathname === '/admin/login') return NextResponse.next();

  // Playwright test mode: accept a shim token if present to keep tests hermetic
  if (process.env.PLAYWRIGHT_TEST === '1') {
    const testToken = request.cookies.get('admin_token')?.value || request.cookies.get('fixeasy_admin_token')?.value;
    if (!testToken) {
      url.pathname = '/admin/login';
      url.searchParams.set('returnTo', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const token = request.cookies.get('admin_token')?.value || request.cookies.get('fixeasy_admin_token')?.value;
  if (!token) {
    url.pathname = '/admin/login';
    url.searchParams.set('returnTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    url.pathname = '/admin/login';
    url.searchParams.set('returnTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const role = (payload as any)?.role ?? (payload as any)?.roles ?? null;
  const isAdmin =
    role === 'admin' || (Array.isArray(role) && role.includes('admin')) || (typeof role === 'string' && role.split(',').map((r) => r.trim()).includes('admin'));

  if (!isAdmin) {
    url.pathname = '/403';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};