import type { NextApiRequest, NextApiResponse } from 'next';

import { getSupabaseServiceRoleClient } from '@/lib/supabaseServiceRoleClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseResult = getSupabaseServiceRoleClient();
  if ('error' in supabaseResult) {
    return res.status(500).json({ error: supabaseResult.error });
  }

  const { proId } = req.body;
  if (!proId) return res.status(400).json({ error: 'Missing proId' });

  const { error } = await supabaseResult.client
    .from('professionals')
    .update({ status: 'approved' })
    .eq('id', proId);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ ok: true });
}
