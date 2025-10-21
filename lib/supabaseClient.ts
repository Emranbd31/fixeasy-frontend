import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type Database = Record<string, never>;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} is not set. Please configure Supabase environment variables.`);
  }
  return value;
}

export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  return createClient<Database>(
    assertEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL'),
    assertEnv(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
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
    assertEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL'),
    supabaseServiceRoleKey ?? assertEnv(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
