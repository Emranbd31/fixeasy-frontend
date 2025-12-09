import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabaseClient";

const schema = z.object({
  jobId: z.string().uuid(),
  proId: z.string().uuid(),
});

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const sb = supabase as any;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { jobId, proId } = parsed.data;

  const { data, error } = await sb
    .from("bookings")
    .update({
      status: "accepted",
      professional_id: proId,
      accepted_by: proId,
      accepted_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Unable to accept job" }, { status: 500 });
  }

  // Placeholder notification hooks; replace with email/SMS integrations.
  return NextResponse.json({
    accepted: true,
    job: data,
    notification: "Customer would be notified here (email/SMS) with pro details and schedule.",
  });
}
