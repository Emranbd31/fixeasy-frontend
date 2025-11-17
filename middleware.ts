import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME } from './lib/adminAuth';

/**
 * Middleware to:
 * 1) Redirect any /admin/* requests on the main site to the admin subdomain
 * Example: https://fixeasy.irish/admin/login -> https://admin.fixeasy.irish/admin/login
 */
export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const { pathname, search } = req.nextUrl;

    const isAdminHost = req.nextUrl.hostname === 'admin.fixeasy.irish';
    const isApiRoute = pathname.startsWith('/api');
    const isAsset = pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/favicon');

    // If the request arrives on the admin domain, rewrite non-admin pages but allow API/static assets untouched
    if (isAdminHost) {
        if (!pathname.startsWith('/admin') && !isApiRoute && !isAsset) {
            url.pathname = '/admin' + pathname;
            url.search = search;
            return NextResponse.rewrite(url);
        }

        // Never run auth logic for API/static paths
        if (!pathname.startsWith('/admin')) {
            return NextResponse.next();
        }

        // If on admin domain and requesting login page while already authenticated, redirect to dashboard
        const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login');
        const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

        if (isLoginPage) {
            if (token) {
                const redirectUrl = req.nextUrl.clone();
                redirectUrl.pathname = '/admin/dashboard';
                return NextResponse.redirect(redirectUrl);
            }
            return NextResponse.next();
        }

        // For all other admin pages, require token; if missing, redirect to login
        if (!token) {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/admin/login';
            redirectUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(redirectUrl);
        }

        return NextResponse.next();
    }

    // If request is for /admin on the main site, redirect to admin subdomain
    if (pathname.startsWith('/admin')) {
        const dest = `https://admin.fixeasy.irish${pathname}${search}`;
        return NextResponse.redirect(dest, 307);
    }

    return NextResponse.next();
}

export const config = {
    // Run this middleware for all routes so we can detect hostname and rewrite appropriately
    matcher: ['/:path*'],
};
