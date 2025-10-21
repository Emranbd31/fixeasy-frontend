import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabaseClient';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getTrimmedValue = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

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
  const name = getTrimmedValue(formData, 'name');
  const email = getTrimmedValue(formData, 'email');
  const phone = getTrimmedValue(formData, 'phone');
  const categoriesRaw = getTrimmedValue(formData, 'categories');
  const experience = getTrimmedValue(formData, 'experience');
  const ibanRaw = getTrimmedValue(formData, 'iban');
  const consentTermsRaw = getTrimmedValue(formData, 'consentTerms');
  const consentBackgroundRaw = getTrimmedValue(formData, 'consentBackground');

  const errors: string[] = [];

  if (name.length < 2) errors.push('Enter your full name.');
  if (!emailPattern.test(email)) errors.push('Enter a valid email.');
  if (phone.length < 7) errors.push('Enter a phone number.');
  if (!categoriesRaw) errors.push('Select at least one category.');
  if (!experience) errors.push('Share your experience.');
  if (ibanRaw && ibanRaw.length < 8) errors.push('IBAN appears too short.');

  const consentTerms = consentTermsRaw === 'true';
  const consentBackground = consentBackgroundRaw === 'true';

  if (!consentTerms || !consentBackground) {
    errors.push('Required consents not granted.');
  }

  let categories: string[] = [];
  if (categoriesRaw) {
    try {
      const parsedCategories = JSON.parse(categoriesRaw) as unknown;
      if (Array.isArray(parsedCategories) && parsedCategories.every((item) => typeof item === 'string')) {
        categories = parsedCategories;
      } else {
        errors.push('Unable to read selected service categories.');
      }
    } catch {
      errors.push('Unable to read selected service categories.');
    }
  }

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

  const photoId = formData.get('photo_id');
  const irishDocument = formData.get('irish_document');
  const insurance = formData.get('insurance');

  if (!(photoId instanceof File) || !(irishDocument instanceof File)) {
    return NextResponse.json(
      { error: 'Photo ID and Irish document are required.' },
      { status: 400 }
    );
  }

  const { data: professional, error: insertError } = await supabase
    .from('professionals')
    .insert({
      user_id: userId,
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
  const ibanMasked = maskIban(ibanRaw || null);

  if (userId) {
    await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          full_name: name,
          phone,
          role: 'professional',
        },
        { onConflict: 'id' }
      );
  }

  const metadataPayload = JSON.stringify({
    name,
    email,
    phone,
    experience,
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
