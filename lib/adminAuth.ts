import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'fixeasy_secret'

/**
 * Middleware to require a valid admin JWT for Next.js API routes.
 * Usage: export default requireAdmin(async (req, res) => { ... })
 */
export function requireAdmin(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ', 2)[1] : (req.cookies && (req.cookies.token as string))
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    try {
      const payload = jwt.verify(token, SECRET)
      // attach payload for handler if needed
      ;(req as any).admin = payload
      return handler(req, res)
    } catch (e) {
      res.status(401).json({ error: 'Unauthorized' })
    }
  }
}

export function getTokenFromReq(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization || ''
  if (authHeader.startsWith('Bearer ')) return authHeader.split(' ', 2)[1]
  if (req.cookies && req.cookies.token) return req.cookies.token as string
  return null
}
// lib/adminAuth.ts
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "fixeasy_admin_token";

/**
 * Read the admin token from the HttpOnly cookie.
 * Works only in server-side / route handlers / middleware.
 */
export function getAdminToken(): string | null {
  // `cookies()` type may be a Promise or a sync object depending on Next version/types.
  // Cast to `any` to avoid type mismatch across Next.js versions while keeping runtime behavior.
  const raw = (cookies() as any).get?.(ADMIN_COOKIE_NAME)?.value ?? (cookies() as any)[ADMIN_COOKIE_NAME];
  if (!raw) return null;

  // Handle "Bearer <token>" or plain token
  if (raw.startsWith("Bearer ")) {
    return raw.slice("Bearer ".length);
  }
  return raw;
}

/**
 * Throw an error if there is no valid admin token.
 * You can use this in server components / route handlers.
 */
export function requireAdminToken(): string {
  const token = getAdminToken();
  if (!token) {
    throw new Error("Admin not authenticated");
  }
  return token;
}

/**
 * Helper to build Authorization header when calling the backend.
 */
export function getAdminAuthHeader():
  | { Authorization: string }
  | Record<string, never> {
  const token = getAdminToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
