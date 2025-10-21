import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createSupabaseServerClient } from '@/lib/supabaseClient';

const proPayloadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  categories: z.string(),
  experience: z.string().min(1),
  iban: z.string().optional(),
  consentTerms: z.string(),
  consentBackground: z.string(),
  user_id: z.string().uuid().optional(),
});

function maskIban(iban?: string | null): string | null {
  if (!iban) return null;
  const stripped = iban.replace(/\s+/g, '');
  if (stripped.length <= 4) return stripped;
  const visible = stripped.slice(-4);
  const masked = stripped
    .slice(0, -4)
    .replace(/[A-Za-z0-9]/g, '•');
  return `${masked}${visible}`;
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());
  const parsed = proPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((issue) => issue.message).join(', ') },
      { status: 400 }
    );
  }

  const photoId = formData.get('photo_id');
  const irishDocument = formData.get('irish_document');
  const insurance = formData.get('insurance');

  if (!(photoId instanceof File) || !(irishDocument instanceof File)) {
    return NextResponse.json(
      { error: 'Photo ID and Irish document are required.' },
      { status: 400 }
    );
  }

  let categories: string[] = [];
  try {
    const parsedCategories = JSON.parse(parsed.data.categories) as unknown;
    if (Array.isArray(parsedCategories) && parsedCategories.every((item) => typeof item === 'string')) {
      categories = parsedCategories;
    } else {
      throw new Error('Invalid categories payload');
    }
  } catch {
    return NextResponse.json({ error: 'Unable to read selected service categories.' }, { status: 400 });
  }
  const consentTerms = parsed.data.consentTerms === 'true';
  const consentBackground = parsed.data.consentBackground === 'true';

  if (!consentTerms || !consentBackground) {
    return NextResponse.json(
      { error: 'Required consents not granted.' },
      { status: 400 }
    );
  }

  const { data: professional, error: insertError } = await supabase
    .from('professionals')
    .insert({
      user_id: parsed.data.user_id ?? null,
      categories,
      insurance_optional: Boolean(insurance),
      kyc_status: 'pending',
    })
    .select('id')
    .single();

  if (insertError || !professional) {
    return NextResponse.json(
      { error: insertError?.message ?? 'Failed to create professional profile' },
      { status: 500 }
    );
  }

  const professionalId = professional.id as string;
  const ibanMasked = maskIban(parsed.data.iban ?? null);

  if (parsed.data.user_id) {
    await supabase
      .from('profiles')
      .upsert(
        {
          id: parsed.data.user_id,
          full_name: parsed.data.name,
          phone: parsed.data.phone,
          role: 'professional',
        },
        { onConflict: 'id' }
      );
  }

  const metadataPayload = JSON.stringify({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    experience: parsed.data.experience,
    ibanMasked,
  });

  const { error: metadataUploadError } = await supabase.storage
    .from('kyc')
    .upload(`${professionalId}/profile.json`, metadataPayload, {
      contentType: 'application/json',
      upsert: true,
    });

  if (metadataUploadError) {
    return NextResponse.json(
      { error: metadataUploadError.message },
      { status: 500 }
    );
  }

  const { error: metadataRecordError } = await supabase
    .from('kyc_documents')
    .insert({
      pro_id: professionalId,
      doc_type: 'profile_meta',
      storage_path: `${professionalId}/profile.json`,
    });

  if (metadataRecordError) {
    return NextResponse.json(
      { error: metadataRecordError.message },
      { status: 500 }
    );
  }

  const uploadDocument = async (file: File, type: string) => {
    const path = `${professionalId}/${type}_${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('kyc')
      .upload(path, file, { contentType: file.type, upsert: true });
    if (uploadError) {
      throw new Error(uploadError.message);
    }
    const { error: docError } = await supabase
      .from('kyc_documents')
      .insert({
        pro_id: professionalId,
        doc_type: type,
        storage_path: path,
      });
    if (docError) {
      throw new Error(docError.message);
    }
  };

  try {
    await uploadDocument(photoId, 'photo_id');
    await uploadDocument(irishDocument, 'irish_document');
    if (insurance instanceof File) {
      await uploadDocument(insurance, 'insurance');
    }
  } catch (uploadError) {
    return NextResponse.json(
      { error: uploadError instanceof Error ? uploadError.message : 'Upload failed' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
