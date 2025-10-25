import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabaseClient';

type SupabaseServiceRoleClientResult =
  | { client: SupabaseClient<Database> }
  | { error: string };

function buildMissingEnvMessage(missingKeys: string[]): string {
  const formattedKeys = missingKeys.join(', ');
  return `Supabase service credentials are not fully configured. Missing: ${formattedKeys}`;
}

export function getSupabaseServiceRoleClient(): SupabaseServiceRoleClientResult {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const missingKeys: string[] = [];
  if (!supabaseUrl) missingKeys.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceRoleKey) missingKeys.push('SUPABASE_SERVICE_ROLE_KEY');

  if (missingKeys.length > 0) {
    return { error: buildMissingEnvMessage(missingKeys) };
  }

  return { client: createClient<Database>(supabaseUrl, serviceRoleKey) };
}
