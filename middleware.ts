
// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "./lib/adminAuth";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect admin pages (NOT /api/admin here)
    const isAdminPage =
        pathname === "/admin" ||
        pathname.startsWith("/admin/");

    // Allow login page without token
    const isLoginPage =
        pathname === "/admin/login" ||
        pathname.startsWith("/admin/login");

    if (!isAdminPage) {
        return NextResponse.next();
    }

    if (isLoginPage) {
        // If already logged in, redirect from /admin/login to /admin/dashboard
        const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
        if (token) {
            const url = req.nextUrl.clone();
            url.pathname = "/admin/dashboard";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Apply middleware only to admin pages
export const config = {
    matcher: ["/admin/:path*"],
};