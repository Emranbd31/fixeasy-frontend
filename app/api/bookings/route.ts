import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabaseClient';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getTrimmedValue = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();

  const formData = await request.formData();
  const service = getTrimmedValue(formData, 'service');
  const summary = getTrimmedValue(formData, 'summary');
  const address = getTrimmedValue(formData, 'address');
  const eircode = getTrimmedValue(formData, 'eircode');
  const preferredDateRaw = getTrimmedValue(formData, 'preferredDate');
  const preferredTimeRaw = getTrimmedValue(formData, 'preferredTime');
  const name = getTrimmedValue(formData, 'name');
  const email = getTrimmedValue(formData, 'email');
  const phone = getTrimmedValue(formData, 'phone');

  const errors: string[] = [];

  if (!service) errors.push('Select a service.');
  if (summary.length < 10 || summary.length > 300) {
    errors.push('Provide a summary between 10 and 300 characters.');
  }
  if (address.length < 5) errors.push('Enter an address.');
  if (eircode.length < 3) errors.push('Enter your Eircode.');
  if (name.length < 2) errors.push('Enter your name.');
  if (!emailPattern.test(email)) errors.push('Enter a valid email.');
  if (phone.length < 7) errors.push('Enter a phone number.');

  const preferredDate = preferredDateRaw || null;
  const preferredTime = preferredTimeRaw || null;

  let userId: string | null = null;
  const userIdRaw = formData.get('user_id');
  if (typeof userIdRaw === 'string' && userIdRaw.trim()) {
    const trimmed = userIdRaw.trim();
    if (!uuidPattern.test(trimmed)) {
      errors.push('Invalid user reference.');
    } else {
      userId = trimmed;
    }
  }

  if (errors.length) {
    return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
  }

  const { data: inserted, error: insertError } = await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      service,
      summary,
      address,
      eircode,
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
    name,
    email,
    phone,
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
