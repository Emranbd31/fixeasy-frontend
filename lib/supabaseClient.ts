import { createClient, type SupabaseClient } from './supabaseStub';

export type Database = Record<string, never>;

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://stub.supabase.localhost';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'stub-anon-key';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
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
    supabaseUrl,
    supabaseServiceRoleKey ?? supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
