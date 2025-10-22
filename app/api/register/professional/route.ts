import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      user_id,
      name,
      email,
      phone,
      category,
      experience,
      rate,
      service_area,
      id_document,
      address_proof,
      qualification_file,
      insurance_file,
      portfolio_files,
      profile_photo,
    } = body || {};

    if (!user_id || !name || !email || !phone || !category || !id_document || !profile_photo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();

    // Upsert professional profile
    const { error } = await supabase
      .from('professionals')
      .upsert({
        user_id,
        name,
        email,
        phone,
        category,
        experience,
        rate,
        service_area,
        id_document,
        address_proof,
        qualification_file,
        insurance_file,
        portfolio_files,
        profile_photo,
        verified: false,
        role: 'professional',
      }, { onConflict: 'user_id' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
