import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth';

const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'https://api.fixeasy.irish').replace(/\/$/, '');

export type BackendResult<T = any> = {
  ok: boolean;
  status: number;
  data: T | null;
  text: string;
};

function stripBearer(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.startsWith('Bearer ') ? value.slice('Bearer '.length) : value;
}

function readCookieFromRequest(req?: NextRequest | Request): string | null {
  if (!req) return null;
  const anyReq = req as any;
  if (typeof anyReq.cookies?.get === 'function') {
    return anyReq.cookies.get(ADMIN_COOKIE_NAME)?.value ?? null;
  }
  if (anyReq.cookies && typeof anyReq.cookies === 'object') {
    return anyReq.cookies[ADMIN_COOKIE_NAME] ?? null;
  }
  const cookieHeader = req.headers?.get('cookie') || req.headers?.get('Cookie');
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map((part) => part.trim());
  for (const part of parts) {
    if (part.startsWith(`${ADMIN_COOKIE_NAME}=`)) {
      return decodeURIComponent(part.split('=', 2)[1]);
    }
  }
  return null;
}

export async function readAdminToken(req?: NextRequest | Request): Promise<string | null> {
  const header = req?.headers?.get('authorization') || req?.headers?.get('Authorization');
  if (header?.startsWith('Bearer ')) {
    return header.slice('Bearer '.length);
  }

  const requestCookie = readCookieFromRequest(req);
  if (requestCookie) {
    return stripBearer(requestCookie);
  }

  try {
    const storeMaybePromise = cookies() as any;
    const store =
      typeof storeMaybePromise?.then === 'function' ? await storeMaybePromise : storeMaybePromise;
    const getter = typeof store?.get === 'function' ? store.get.bind(store) : undefined;
    const value =
      getter ? getter(ADMIN_COOKIE_NAME)?.value ?? null : (store as any)?.[ADMIN_COOKIE_NAME] ?? null;
    if (value) return stripBearer(value);
  } catch {
    // Not in a server context that supports cookies()
  }

  if (typeof document !== 'undefined') {
    const match = document.cookie
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`));
    if (match) {
      return stripBearer(decodeURIComponent(match.split('=', 2)[1]));
    }
  }

  return null;
}

export async function fetchAdminBackend<T = any>(
  path: string,
  init: RequestInit = {},
  req?: NextRequest | Request
): Promise<BackendResult<T>> {
  const token = await readAdminToken(req);
  if (!token) {
    return {
      ok: false,
      status: 401,
      data: { error: 'Unauthorized' } as T,
      text: '',
    };
  }

  const url =
    path.startsWith('http://') || path.startsWith('https://')
      ? path
      : `${BACKEND_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = new Headers(init.headers || {});
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    cache: 'no-store',
    ...init,
    headers,
  });

  const text = await res.text().catch(() => '');
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { ok: res.ok, status: res.status, data, text };
}
