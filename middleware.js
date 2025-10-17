import { NextResponse } from 'next/server'
import { decodeSession, SESSION_COOKIE } from './lib/admin-session'

const ADMIN_PATH_PREFIX = '/dashboard/admin'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  const session = await decodeSession(sessionCookie)
  if (!session) {
    const loginUrl = new URL('/auth/admin', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/admin/:path*']
}
