import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Token is managed in localStorage on the client now; server middleware cannot read it.
  // Allow navigation and let client-side fetches enforce Authorization headers.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};