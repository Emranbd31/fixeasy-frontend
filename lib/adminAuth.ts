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
export async function getAdminToken(): Promise<string | null> {
  try {
    const storeMaybePromise = cookies() as any;
    const store =
      typeof storeMaybePromise?.then === "function" ? await storeMaybePromise : storeMaybePromise;
    const raw =
      typeof store?.get === "function"
        ? store.get(ADMIN_COOKIE_NAME)?.value ?? null
        : (store as any)?.[ADMIN_COOKIE_NAME] ?? null;
    if (!raw) return null;
    return raw.startsWith("Bearer ") ? raw.slice("Bearer ".length) : raw;
  } catch {
    return null;
  }
}

/**
 * Throw an error if there is no valid admin token.
 * You can use this in server components / route handlers.
 */
export async function requireAdminToken(): Promise<string> {
  const token = await getAdminToken();
  if (!token) {
    throw new Error("Admin not authenticated");
  }
  return token;
}

/**
 * Helper to build Authorization header when calling the backend.
 */
export async function getAdminAuthHeader(): Promise<
  { Authorization: string } | Record<string, never>
> {
  const token = await getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// App Router (route handlers) admin guard: header secret
export function requireAdminSecret(request: Request): { error: string } | null {
  const expected = process.env.ADMIN_SECRET?.trim();
  if (!expected) return { error: 'Unauthorized' };

  const provided = request.headers.get('x-admin-secret')?.trim();
  if (!provided || provided !== expected) return { error: 'Unauthorized' };

  return null;
}
