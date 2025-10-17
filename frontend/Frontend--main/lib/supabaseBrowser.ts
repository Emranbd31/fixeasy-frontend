import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { CookieOptions } from '@supabase/auth-helpers-shared';

let browserClient: SupabaseClient | null = null;

const cookieOptions: Partial<CookieOptions> = {
  name: 'fixeasy-auth',
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7,
};

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserSupabaseClient({
      cookieOptions,
    });
  }
  return browserClient;
}
