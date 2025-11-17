import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type Database = Record<string, never>;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function safeEnv(value: string | undefined, name: string, ssrFallback: string): string {
  if (value && value.length > 0) return value;
  if (typeof window === 'undefined') {
    return ssrFallback;
  }
  throw new Error(`${name} is not set. Please configure Supabase environment variables.`);
}

/**
 * Browser/client-side Supabase factory. Uses only public NEXT_PUBLIC keys.
 */
export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  return createClient<Database>(
    safeEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL', 'http://localhost'),
    safeEnv(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'public-anon-key'),
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
}

/**
 * Server-side Supabase factory. Uses service role key when available.
 * IMPORT THIS IN SERVER/ROUTE HANDLERS ONLY.
 */
export function createSupabaseServerClient(): SupabaseClient<Database> {
  return createClient<Database>(
    safeEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL', 'http://localhost'),
    supabaseServiceRoleKey ?? safeEnv(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'public-anon-key'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Export a convenience browser client for existing client components that import `supabase`.
// This ensures server-only code should import createSupabaseServerClient explicitly.
export const supabase = (typeof window !== 'undefined') ? createSupabaseBrowserClient() : (null as unknown as SupabaseClient<Database>);
