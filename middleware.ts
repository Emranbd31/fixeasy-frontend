import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME } from './lib/adminAuth';

/**
 * Middleware to:
 * 1) Redirect any /admin/* requests on the main site to the admin subdomain
 * Example: https://fixeasy.irish/admin/login -> https://admin.fixeasy.irish/admin/login
 */
export function middleware(req: NextRequest) {
    if (process.env.NODE_ENV !== 'production') {
        return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    const { pathname, search } = req.nextUrl;

    const hostname = req.nextUrl.hostname;
    const isLocalAdminHost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isAdminHost = hostname === 'admin.fixeasy.irish' || isLocalAdminHost;
    const isApiRoute = pathname.startsWith('/api');
    const isAsset = pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/favicon');

    // If the request arrives on the admin domain, rewrite non-admin pages but allow API/static assets untouched
    if (isAdminHost) {
        if (!pathname.startsWith('/admin') && !isApiRoute && !isAsset) {
            // Send bare domain traffic straight to the login page
            url.pathname = pathname === '/' ? '/admin/login' : `/admin${pathname}`;
            url.search = search;
            return NextResponse.rewrite(url);
        }

        // Never run auth logic for API/static paths
        if (!pathname.startsWith('/admin')) {
            return NextResponse.next();
        }

        // If on admin domain and requesting login page while already authenticated, redirect to dashboard
        const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login');
        if (pathname === '/admin') {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/admin/login';
            return NextResponse.redirect(redirectUrl);
        }
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
    if (!isLocalAdminHost && pathname.startsWith('/admin')) {
        const dest = `https://admin.fixeasy.irish${pathname}${search}`;
        return NextResponse.redirect(dest, 307);
    }

    return NextResponse.next();
}

export const config = {
    // Run this middleware for pages (including `/` and `/admin/*`) but avoid static and API assets.
    // Narrowing the matcher reduces unnecessary middleware invocations and avoids touching
    // `/_next/static`, images and `favicon.ico`. If Next deprecates middleware entirely,
    // consider replacing this behavior with the new `proxy` config or a dedicated edge
    // function for host-based rewrites.
    matcher: [
        '/',
        '/admin/:path*',
        // Match all top-level pages except Next.js static assets, images, api and favicon
        '/((?!_next/static|_next/image|api|static|favicon.ico).*)',
    ],
};
