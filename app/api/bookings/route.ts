import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createSupabaseServerClient } from '@/lib/supabaseClient';

const bookingPayloadSchema = z.object({
  service: z.string().min(1),
  summary: z.string().min(10).max(300),
  address: z.string().min(5),
  eircode: z.string().min(3),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  user_id: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();

  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());

  const parsed = bookingPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((issue) => issue.message).join(', ') },
      { status: 400 }
    );
  }

  const summaryWithContact = `${parsed.data.summary}\n\nContact: ${parsed.data.name} · ${parsed.data.email} · ${parsed.data.phone}`;

  const { data: inserted, error: insertError } = await supabase
    .from('bookings')
    .insert({
      user_id: parsed.data.user_id ?? null,
      service: parsed.data.service,
      summary: summaryWithContact,
      address: parsed.data.address,
      eircode: parsed.data.eircode,
      date: parsed.data.preferredDate ?? null,
      time: parsed.data.preferredTime ?? null,
    })
    .select('id')
    .single();

  if (insertError || !inserted) {
    return NextResponse.json(
      { error: insertError?.message ?? 'Failed to create booking' },
      { status: 500 }
    );
  }

  const bookingId = inserted.id as string;
  const photoPaths: string[] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('photos_')) continue;
    if (!(value instanceof File)) continue;
    const path = `booking-photos/${bookingId}/${Date.now()}_${value.name}`;
    const { error: uploadError } = await supabase.storage
      .from('booking-photos')
      .upload(path, value, {
        contentType: value.type,
        upsert: true,
      });
    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }
    photoPaths.push(path);
  }

  if (photoPaths.length) {
    await supabase
      .from('bookings')
      .update({ photo_urls: photoPaths })
      .eq('id', bookingId);
  }

  return NextResponse.json({ reference: bookingId }, { status: 201 });
}
