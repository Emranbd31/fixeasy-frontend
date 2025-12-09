import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  service: z.string().min(1),
  subService: z.string().optional(),
  requestType: z.enum(["quote", "book"]).default("quote"),
  urgency: z.enum(["emergency", "scheduled"]).optional(),
  description: z.string().optional(),
  address: z.string().min(3),
  appointmentStart: z.string().optional().nullable(),
  contactName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  abVariant: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const data = parsed.data;
  if (!data.email && !data.phone) {
    return NextResponse.json({ error: "Email or phone required" }, { status: 400 });
  }
  if (data.requestType === "book" && !data.appointmentStart) {
    return NextResponse.json({ error: "Appointment time required for scheduled bookings" }, { status: 400 });
  }

  // In a real implementation, persist the lead and trigger notifications here.
  return NextResponse.json({ received: true, lead: data });
}
