import type { NextApiRequest, NextApiResponse } from 'next';

import { getSupabaseServiceRoleClient } from '@/lib/supabaseServiceRoleClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseResult = getSupabaseServiceRoleClient();
  if ('error' in supabaseResult) {
    return res.status(500).json({ error: supabaseResult.error });
  }

  const { data, error } = await supabaseResult.client
    .from('activity_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ logs: data ?? [] });
}
