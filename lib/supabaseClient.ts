import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type Database = Record<string, never>;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function logMissingEnv(name: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[supabase] ${name} is not configured. Falling back to disabled client mode.`);
  }
}

export function createSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    logMissingEnv(!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export function createSupabaseServerClient(): SupabaseClient<Database> | null {
  if (!supabaseUrl) {
    logMissingEnv('NEXT_PUBLIC_SUPABASE_URL');
    return null;
  }

  const serviceKey = supabaseServiceRoleKey ?? supabaseAnonKey;
  if (!serviceKey) {
    logMissingEnv(supabaseServiceRoleKey ? 'SUPABASE_SERVICE_ROLE_KEY' : 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return null;
  }

  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
