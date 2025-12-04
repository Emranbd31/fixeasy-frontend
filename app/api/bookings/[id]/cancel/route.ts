import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabaseClient";

const schema = z.object({
  reason: z.string().optional(),
});

const MIN_LATE_FEE = 20;
const LATE_FEE_RATE = 0.1;
const CUTOFF_HOURS = 24;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const bookingId = (await params).id;
  const body = await request.json().catch(() => ({}));
  schema.parse(body); // currently unused but validates shape

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

  if (booking.status === "cancelled") {
    return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
  }

  let cancellation_fee = 0;
  if (diffHours < CUTOFF_HOURS) {
    const estimate =
      Number(booking.price_estimate ?? booking.priceEstimate ?? booking.budget ?? 0) || 0;
    cancellation_fee = Math.max(MIN_LATE_FEE, Math.round(estimate * LATE_FEE_RATE * 100) / 100);
  }

  const { error: updateErr } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      cancellation_fee,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ status: "cancelled", cancellation_fee, cutoff_passed: diffHours < CUTOFF_HOURS });
}
