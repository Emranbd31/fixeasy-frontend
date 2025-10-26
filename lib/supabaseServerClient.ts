import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './supabase.types';

function safeEnv(value: string | undefined, fallback: string): string {
  if (value && value.length > 0) {
    return value;
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'Supabase environment variables are not configured. Falling back to placeholder values; server-side data will be unavailable until real keys are provided.'
    );
  }

  return fallback;
}

const supabaseUrl = safeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, 'http://localhost:54321');
const supabaseAnonKey = safeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'public-anon-key');
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;

let adminClient: SupabaseClient<Database> | null = null;

export function createSupabaseServerClient(): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createSupabaseAdminClient(): SupabaseClient<Database> | null {
  if (!supabaseServiceRoleKey) {
    console.warn('Supabase service role credentials are not configured.');
    return null;
  }

  if (!adminClient) {
    adminClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}

export type { Database } from './supabase.types';
