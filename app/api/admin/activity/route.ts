export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Supabase credentials not configured" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
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

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Supabase credentials not configured" }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.action || !body.actor) {
      return NextResponse.json({ error: "Missing activity payload" }, { status: 400 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const record = {
      action: body.action,
      actor: body.actor,
      target_id: body.target_id ?? null,
      details: body.details ?? null,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase.from("activity_logs").insert([record]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, record });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown" }, { status: 500 });
  }
}
