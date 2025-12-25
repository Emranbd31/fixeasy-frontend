import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type Database = Record<string, never>;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function mustGetEnv(name: string): string {
  const raw = process.env[name];
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (value) return value;
  throw new Error(`Missing required environment variable: ${name}`);
}

function mustGetSupabaseUrl(): string {
  return mustGetEnv('NEXT_PUBLIC_SUPABASE_URL');
}

function mustGetSupabaseAnonKey(): string {
  const raw = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY) ?? '';
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (value) return value;
  throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_KEY)');
}

function mustGetServiceRoleKey(): string {
  return mustGetEnv('SUPABASE_SERVICE_ROLE_KEY');
}

/**
 * Browser/client-side Supabase factory. Uses only public NEXT_PUBLIC keys.
 */
export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  return createClient<Database>(
    mustGetSupabaseUrl(),
    mustGetSupabaseAnonKey(),
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
 * Server-side Supabase factory for READ operations.
 * Uses anon key; safe for select/list endpoints.
 */
export function createSupabaseServerClient(): SupabaseClient<Database> {
  return createClient<Database>(
    mustGetSupabaseUrl(),
    mustGetSupabaseAnonKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Server-side Supabase factory for WRITE operations.
 * Requires service role key; use this for insert/update/delete.
 */
export function createSupabaseServerServiceRoleClient(): SupabaseClient<Database> {
  return createClient<Database>(
    mustGetSupabaseUrl(),
    mustGetServiceRoleKey(),
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
