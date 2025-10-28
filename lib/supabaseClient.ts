import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Use a permissive database type until generated Supabase types are available.
// This prevents App Router builds from failing when new tables (such as
// `support_tickets`) are referenced before the type definitions are updated.
export type Database = any;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function safeEnv(value: string | undefined, name: string, ssrFallback: string): string {
  if (value && value.length > 0) return value;
  if (typeof window === 'undefined') {
    return ssrFallback;
  }
  throw new Error(`${name} is not set. Please configure Supabase environment variables.`);
}

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

export const supabase = createSupabaseBrowserClient();
