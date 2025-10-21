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

  const preferredDate = parsed.data.preferredDate?.trim()
    ? parsed.data.preferredDate.trim()
    : null;
  const preferredTime = parsed.data.preferredTime?.trim()
    ? parsed.data.preferredTime.trim()
    : null;

  const { data: inserted, error: insertError } = await supabase
    .from('bookings')
    .insert({
      user_id: parsed.data.user_id ?? null,
      service: parsed.data.service,
      summary: parsed.data.summary,
      address: parsed.data.address,
      eircode: parsed.data.eircode,
      date: preferredDate,
      time: preferredTime,
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
  const bucketName = 'booking-photos';
  const bookingFolder = `${bookingId}`;
  const photoPaths: string[] = [];

  const contactPayload = JSON.stringify({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
  });

  const { error: contactUploadError } = await supabase.storage
    .from(bucketName)
    .upload(`${bookingFolder}/contact.json`, contactPayload, {
      contentType: 'application/json',
      upsert: true,
    });

  if (contactUploadError) {
    return NextResponse.json(
      { error: contactUploadError.message },
      { status: 500 }
    );
  }

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('photos_')) continue;
    if (!(value instanceof File)) continue;
    const path = `${bookingFolder}/${Date.now()}_${value.name}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
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
    const { error: photoUpdateError } = await supabase
      .from('bookings')
      .update({ photo_urls: photoPaths })
      .eq('id', bookingId);

    if (photoUpdateError) {
      return NextResponse.json(
        { error: photoUpdateError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ reference: bookingId }, { status: 201 });
}
