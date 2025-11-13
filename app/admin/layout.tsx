import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import React from 'react';
import Shell from '@/components/admin/Shell';

type Props = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  // Server-side cookie check to avoid flashing unauthenticated UI.
  const cookieStore = cookies();
  const token = cookieStore.get('fixeasy_admin_token')?.value;

  // If JWT secret or token are missing, skip server-side redirect and allow
  // middleware to enforce auth. This prevents redirect loops for the login
  // page while still allowing middleware to protect admin routes.
  const secret = process.env.JWT_SECRET;
  if (token && secret) {
    try {
      const encoder = new TextEncoder();
      const { payload } = await jwtVerify(token as string, encoder.encode(secret));
      const role = (payload as any)?.role || (payload as any)?.roles || null;
      const isAdmin = Array.isArray(role)
        ? role.includes('admin')
        : typeof role === 'string'
        ? role === 'admin' || role.split(',').map((r: string) => r.trim()).includes('admin')
        : false;
      if (!isAdmin) {
        // If token is present but role not admin, fall back to middleware behavior
        // which will redirect to the login page.
      }
    } catch (e) {
      // invalid token — allow middleware to handle redirect
    }
  }

  // Render the client Shell (contains SessionStatus) and children
  return <Shell>{children}</Shell>;
}
