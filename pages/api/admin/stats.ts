import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
	try {
		const [{ count: users }, { count: professionals }, { count: bookings }, { data: paymentsData }] = await Promise.all([
			supabase.from('profiles').select('id', { count: 'exact', head: true }),
			supabase.from('professionals').select('id', { count: 'exact', head: true }),
			supabase.from('bookings').select('id', { count: 'exact', head: true }),
			supabase.from('payments').select('amount'),
		]);
		const payments = paymentsData ? paymentsData.length : 0;
		const totalRevenue = paymentsData ? paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0) : 0;
		res.json({ users, professionals, bookings, payments, totalRevenue });
	} catch (e) {
		res.status(500).json({ error: 'Failed to fetch stats' });
	}
}