import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-06-20" }) : null;

const schema = z.object({
  paymentIntentId: z.string().min(3),
  action: z.enum(["capture", "cancel"]).default("capture"),
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

  try {
    const result =
      parsed.data.action === "cancel"
        ? await stripe.paymentIntents.cancel(parsed.data.paymentIntentId)
        : await stripe.paymentIntents.capture(parsed.data.paymentIntentId);

    return NextResponse.json({ status: result.status, paymentIntentId: result.id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update payment intent" }, { status: 500 });
  }
}
