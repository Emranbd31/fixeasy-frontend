import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { createSupabaseServerServiceRoleClient } from "@/lib/supabaseClient";
import { getEnvTrimmed } from "@/lib/env";

const stripeSecret = getEnvTrimmed("STRIPE_SECRET_KEY");
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-06-20" }) : null;

const schema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("eur"),
  paymentMethodId: z.string().min(3),
  bookingId: z.string().optional(),
});

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(parsed.data.amount * 100),
      currency: parsed.data.currency,
      payment_method: parsed.data.paymentMethodId,
      capture_method: "manual",
      confirm: true,
      metadata: {
        bookingId: parsed.data.bookingId ?? "",
      },
    });

    if (parsed.data.bookingId) {
      try {
        const supabase = createSupabaseServerServiceRoleClient() as any;
        await supabase
          .from("bookings")
          .update({ payment_intent_id: intent.id })
          .eq("id", parsed.data.bookingId);
      } catch (err) {
        console.error("Failed to store payment intent id", err);
      }
    }

    return NextResponse.json({ paymentIntentId: intent.id, status: intent.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create payment intent" }, { status: 500 });
  }
}
