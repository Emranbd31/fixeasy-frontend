import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerServiceRoleClient } from "@/lib/supabaseClient";

const schema = z.union([
  z.object({ jobId: z.string().uuid(), proId: z.string().uuid() }),
  z.object({ bookingId: z.string().uuid(), professionalId: z.string().uuid() }),
]);

export async function POST(request: Request) {
  const supabase = createSupabaseServerServiceRoleClient();
  const sb = supabase as any;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== 'production') {
      const keys = body && typeof body === 'object' ? Object.keys(body as any).sort() : [];
      // eslint-disable-next-line no-console
      console.log('[jobs/accept] invalid payload keys', {
        hasBody: Boolean(body),
        keys,
      });
    }
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const jobId = (parsed.data as any).jobId ?? (parsed.data as any).bookingId;
  const proId = (parsed.data as any).proId ?? (parsed.data as any).professionalId;

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
