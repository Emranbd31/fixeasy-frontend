import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabaseClient";

const schema = z.object({
  newStart: z.string().datetime(),
  newEnd: z.string().datetime().optional(),
});

const CUTOFF_HOURS = 24;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const bookingId = (await params).id;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reschedule payload" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient() as any;
  const { data: booking, error: fetchErr } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .maybeSingle();

  if (fetchErr || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const scheduled = booking.scheduled_start || booking.appointmentStart || booking.date || null;
  if (!scheduled) {
    return NextResponse.json({ error: "Booking has no scheduled time" }, { status: 400 });
  }

  const scheduledDate = new Date(scheduled);
  const now = new Date();
  const diffHours = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (diffHours < CUTOFF_HOURS) {
    return NextResponse.json({ error: "Cannot reschedule within 24 hours of the appointment" }, { status: 400 });
  }

  const { error: updateErr } = await supabase
    .from("bookings")
    .update({
      scheduled_start: parsed.data.newStart,
      scheduled_end: parsed.data.newEnd ?? null,
      status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ status: "pending", scheduled_start: parsed.data.newStart });
}
