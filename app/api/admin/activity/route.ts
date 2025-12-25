import { NextResponse } from "next/server";
import { createSupabaseServerClient } from '@/lib/supabaseClient';
import { requireAdminSecret } from '@/lib/adminAuth';

export async function GET(request: Request) {
  // TODO: E2E treats this endpoint as non-blocking (WARN on non-200) because activity logs are optional.
  const guard = requireAdminSecret(request);
  if (guard) return NextResponse.json(guard, { status: 401 });

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(20);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ logs: data });
}
