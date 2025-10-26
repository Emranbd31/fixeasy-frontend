'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './supabase.types';

function safeEnv(value: string | undefined, fallback: string): string {
  if (value && value.length > 0) {
    return value;
  }
  if (process.env.NODE_ENV !== 'production') {
    return fallback;
  }
  throw new Error('Missing Supabase configuration.');
}

const supabaseUrl = safeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, 'http://localhost:54321');
const supabaseAnonKey = safeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'public-anon-key');

let browserClient: SupabaseClient<Database> | null = null;

export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}

export type { Database } from './supabase.types';
