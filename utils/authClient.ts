import { decodeJwt } from 'jose';

/**
 * Decode JWT and return ms remaining until expiration. Returns null if token missing or no exp.
 */
export function decodeExpMs(token?: string | null): number | null {
  if (!token) return null;
  try {
    const payload = decodeJwt(token) as any;
    if (!payload || !payload.exp) return null;
    return payload.exp * 1000 - Date.now();
  } catch (e) {
    return null;
  }
}
