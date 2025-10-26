'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';

function safeEnv(value: string | undefined, fallback: string): string {
  if (value && value.length > 0) {
    return value;
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '⚠️ Supabase environment variables are not configured. Falling back to placeholder values — authentication may not work until valid keys are provided.'
    );
    throw new Error('Missing Supabase configuration in production.');
  }

  // In development, fallback is okay for local use
  return fallback;
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
