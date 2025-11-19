import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "fixeasy_admin_token";
const ADMIN_HOST = "admin.fixeasy.irish";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const host = req.headers.get("host") ?? "";
  const isAdminHost = host.includes(ADMIN_HOST);

  // rewrite bare admin host traffic (skip assets and API)
  const isAsset = pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname === "/favicon.ico";
  const isApi = pathname.startsWith("/api");

  if (isAdminHost && !pathname.startsWith("/admin") && !isAsset && !isApi) {
    url.pathname = pathname === "/" ? "/admin/login" : `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  const isAdminRoute =
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/_next");

  const isAdminLogin = pathname === "/admin/login" || pathname === "/admin/login/";

  if (isAdminRoute) {
    const token = req.cookies.get(ADMIN_COOKIE);

    if (!token && !isAdminLogin) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
