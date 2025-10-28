import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      support_tickets: {
        Row: {
          id: string;
          user_email: string | null;
          message: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_email?: string | null;
          message?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_email?: string | null;
          message?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

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
