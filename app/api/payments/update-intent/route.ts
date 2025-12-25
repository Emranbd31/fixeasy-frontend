import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { createSupabaseServerServiceRoleClient } from "@/lib/supabaseClient";
import { getEnvTrimmed } from "@/lib/env";

const stripeSecret = getEnvTrimmed("STRIPE_SECRET_KEY");
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-06-20" }) : null;

const schema = z.object({
  bookingId: z.string().uuid().optional(),
  paymentIntentId: z.string().optional(),
  amount: z.number().positive(),
});

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  let paymentIntentId = parsed.data.paymentIntentId;

  if (!paymentIntentId && parsed.data.bookingId) {
    try {
      const supabase = createSupabaseServerServiceRoleClient() as any;
      const { data, error } = await supabase
        .from("bookings")
        .select("payment_intent_id")
        .eq("id", parsed.data.bookingId)
        .maybeSingle();
      if (error) throw error;
      paymentIntentId = data?.payment_intent_id;
    } catch (err) {
      console.error("Failed to load payment intent id", err);
    }
  }

  if (!paymentIntentId) {
    return NextResponse.json({ error: "Payment intent not found for booking" }, { status: 404 });
  }

  try {
    const intent = await stripe.paymentIntents.update(paymentIntentId, {
      amount: Math.round(parsed.data.amount * 100),
    });

    if (parsed.data.bookingId) {
      try {
        const supabase = createSupabaseServerServiceRoleClient() as any;
        await supabase
          .from("bookings")
          .update({ payment_intent_id: intent.id, price_estimate: parsed.data.amount })
          .eq("id", parsed.data.bookingId);
      } catch (err) {
        console.error("Failed to update booking quote", err);
      }
    }

    return NextResponse.json({ paymentIntentId: intent.id, status: intent.status, amount: intent.amount });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update payment intent" }, { status: 500 });
  }
}
