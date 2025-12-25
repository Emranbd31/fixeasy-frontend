import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerServiceRoleClient } from "@/lib/supabaseClient";

const uuidSchema = z.string().uuid();

async function readBodyAsObject(request: Request): Promise<Record<string, unknown>> {
  try {
    const json = await request.json();
    if (json && typeof json === 'object' && !Array.isArray(json)) return json as Record<string, unknown>;
    return {};
  } catch {
    try {
      const fd = await request.formData();
      return Object.fromEntries(fd.entries());
    } catch {
      return {};
    }
  }
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerServiceRoleClient();
  const sb = supabase as any;
  const body = await readBodyAsObject(request);

  const bookingId = (body as any).bookingId ?? (body as any).jobId ?? (body as any).booking_id ?? (body as any).id;
  const proUserId =
    (body as any).professionalId ??
    (body as any).proId ??
    (body as any).professional_id ??
    (body as any).pro_id ??
    (body as any).user_id;

  const bookingIdParsed = uuidSchema.safeParse(bookingId);
  const proUserIdParsed = uuidSchema.safeParse(proUserId);

  if (!bookingIdParsed.success || !proUserIdParsed.success) {
    const keys = Object.keys(body || {}).sort();
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[jobs/accept] invalid payload keys', { keys });
    }
    return NextResponse.json(
      { error: 'Invalid payload', keys },
      { status: 400 }
    );
  }

  // Note: bookings.professional_id appears to be integer in this project; do NOT write UUID into it.
  const nowIso = new Date().toISOString();

  const { data, error } = await sb
    .from("bookings")
    .update({
      status: "accepted",
      accepted_by: proUserIdParsed.data,
      accepted_at: nowIso,
      updated_at: nowIso,
    })
    .eq("id", bookingIdParsed.data)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Unable to accept job" }, { status: 500 });
  }

  // Placeholder notification hooks; replace with email/SMS integrations.
  return NextResponse.json({
    ok: true,
    bookingId: bookingIdParsed.data,
    accepted_by: proUserIdParsed.data,
  });
}
