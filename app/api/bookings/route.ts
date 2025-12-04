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

const bookingActionSchema = z.object({
  bookingId: z.string().uuid(),
  action: z.enum(['accept', 'decline', 'start', 'complete']),
  professionalId: z.string().uuid().optional(),
});

const ACTION_STATUS: Record<'accept' | 'decline' | 'start' | 'complete', string> = {
  accept: 'confirmed',
  decline: 'cancelled',
  start: 'in_progress',
  complete: 'completed',
};

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const sb = supabase as any;
  const { searchParams } = new URL(request.url);
  const professionalId = searchParams.get('professionalId');
  const unassigned = searchParams.get('unassigned') === 'true';

  if (!professionalId && !unassigned) {
    return NextResponse.json({ error: 'professionalId is required' }, { status: 400 });
  }

  let query = sb.from('bookings').select('*').order('created_at', { ascending: false });

  if (unassigned) {
    query = query.is('professional_id', null).in('status', ['pending', 'awaiting_confirmation']);
  } else {
    query = query.eq('professional_id', professionalId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: data || [] });
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const sb = supabase as any;

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

  const { data: inserted, error: insertError } = await sb
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

  const bookingId = (inserted as any).id as string;
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
    const { error: photoUpdateError } = await sb
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

export async function PATCH(request: Request) {
  const supabase = createSupabaseServerClient();
  const sb = supabase as any;
  const payload = await request.json().catch(() => null);
  const parsed = bookingActionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const nextStatus = ACTION_STATUS[parsed.data.action];
  if (parsed.data.action === 'accept' && !parsed.data.professionalId) {
    return NextResponse.json({ error: 'professionalId is required to accept a booking' }, { status: 400 });
  }

  const { data, error } = await sb
    .from('bookings')
    .update({
      status: nextStatus,
      updated_at: new Date().toISOString(),
      professional_id: parsed.data.action === 'accept' ? parsed.data.professionalId : undefined,
    })
    .eq('id', parsed.data.bookingId)
    .select('*')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Failed to update booking' }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}
