import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  service: z.string().min(1),
  subService: z.string().optional(),
  urgency: z.enum(["emergency", "scheduled"]),
  description: z.string().optional(),
  address: z.string().min(3),
  appointmentStart: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // In a real implementation, persist the lead and trigger notifications here.
  return NextResponse.json({ received: true, lead: parsed.data });
}
