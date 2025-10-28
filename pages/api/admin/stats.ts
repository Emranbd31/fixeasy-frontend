import type { NextApiRequest, NextApiResponse } from 'next';

import { getSupabaseServiceRoleClient } from '@/lib/supabaseServiceRoleClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseResult = getSupabaseServiceRoleClient();
  if ('error' in supabaseResult) {
    return res.status(500).json({ error: supabaseResult.error });
  }

  try {
    const [{ count: users }, { count: professionals }, { count: bookings }, { data: paymentsData }] =
      await Promise.all([
        supabaseResult.client.from('profiles').select('id', { count: 'exact', head: true }),
        supabaseResult.client.from('professionals').select('id', { count: 'exact', head: true }),
        supabaseResult.client.from('bookings').select('id', { count: 'exact', head: true }),
        supabaseResult.client.from('payments').select('amount'),
      ]);

    const payments = paymentsData ? paymentsData.length : 0;
    const totalRevenue = paymentsData ? paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0) : 0;

    res.json({ users, professionals, bookings, payments, totalRevenue });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stats';
    res.status(500).json({ error: message });
  }
}
