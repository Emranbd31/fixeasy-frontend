import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "fixeasy_admin_token";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // match internal route-group path AND public path
  const isAdminRoute =
    pathname.includes("/admin") && !pathname.startsWith("/_next");

  const isAdminLogin =
    pathname.endsWith("/admin/login") ||
    pathname.endsWith("/(admin)/admin/login");

  if (isAdminRoute) {
    const token = req.cookies.get(ADMIN_COOKIE);

    if (!token && !isAdminLogin) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

// must match ALL admin paths, including route-group paths
export const config = {
  matcher: [
    "/admin/:path*",
    "/(admin)/admin/:path*",
    "/(admin)/admin",
  ],
};
