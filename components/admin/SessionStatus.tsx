'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { decodeJwt } from 'jose';

type Status = 'checking' | 'active' | 'expiring' | 'invalid';

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function SessionStatus() {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>('checking');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Don't show indicator on login page
    if (pathname && pathname.startsWith('/admin/login')) return;

    let mounted = true;

    async function check() {
      try {
        const res = await fetch('/api/admin/verify', { method: 'GET', credentials: 'include' });
        const json = await res.json().catch(() => null);
        if (!mounted) return;
        if (!json || json.valid !== true) {
          setStatus('invalid');
          // redirect to login
          router.replace('/admin/login');
          return;
        }

        // If server didn't provide exp, rely on valid flag
        const tokenCookie = typeof document !== 'undefined' ? document.cookie.split('; ').find((c) => c.startsWith('fixeasy_admin_token=')) : undefined;
        const token = tokenCookie ? decodeURIComponent(tokenCookie.split('=')[1]) : null;
        let secondsRemaining = Number.POSITIVE_INFINITY;
        if (token) {
          try {
            const payload = decodeJwt(token) as any;
            if (payload && payload.exp) {
              secondsRemaining = payload.exp * 1000 - Date.now();
            }
          } catch (e) {
            // ignore decode errors
          }
        }

        if (Number.isFinite(secondsRemaining) && secondsRemaining <= 0) {
          setStatus('invalid');
          router.replace('/admin/login');
          return;
        }

        // If less than 5 minutes (300000 ms) remaining -> expiring
        if (Number.isFinite(secondsRemaining) && secondsRemaining < 5 * 60 * 1000) {
          setStatus('expiring');
        } else {
          setStatus('active');
        }
      } catch (e) {
        if (!mounted) return;
        setStatus('invalid');
        router.replace('/admin/login');
      }
    }

    // initial check
    check();

    // poll every 60 seconds
    intervalRef.current = window.setInterval(() => {
      check();
    }, 60_000);

    return () => {
      mounted = false;
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [pathname, router]);

  const color = {
    checking: 'bg-gray-400',
    active: 'bg-green-500',
    expiring: 'bg-amber-500',
    invalid: 'bg-red-500',
  }[status];

  const text = {
    checking: 'Checking...',
    active: 'Session Active',
    expiring: 'Expiring Soon',
    invalid: 'Session Invalid',
  }[status];

  return (
    <div aria-live="polite">
      <div className={cls('text-xs text-white px-2 py-1 rounded-full', color)}>{text}</div>
    </div>
  );
}
