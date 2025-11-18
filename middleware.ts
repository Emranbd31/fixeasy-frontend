import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "fixeasy_admin_token";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const isAdminRoute =
    pathname.includes("/admin") &&
    !pathname.startsWith("/_next");

  const isAdminLogin =
    pathname.endsWith("/admin/login");

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
  matcher: [
    "/admin/:path*",
    "/(admin)/admin/:path*",
  ],
};
