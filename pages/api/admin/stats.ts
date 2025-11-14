import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth } from '@/lib/adminAuth';

function getSupabase() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	const apiKey = serviceKey ?? anonKey;

	if (!url || !apiKey) {
		throw new Error('Missing Supabase configuration');
	}

	return createClient(url, apiKey);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
	try {
		await requireAdminAuth(req);
	} catch (error: any) {
		return res.status(error.status ?? 401).json({ error: error.message ?? 'Unauthorized' });
	}
	try {
		const supabase = getSupabase();

		// Users: prefer 'profiles', fall back to 'users' if profiles is absent
		const profilesCount = await supabase.from('profiles').select('id', { count: 'exact', head: true });
		let users = profilesCount.count ?? 0;
		if (profilesCount.error) {
			const usersCount = await supabase.from('users').select('id', { count: 'exact', head: true });
			users = usersCount.count ?? 0;
		}

		const professionalsCount = await supabase.from('professionals').select('id', { count: 'exact', head: true });
		const bookingsCount = await supabase.from('bookings').select('id', { count: 'exact', head: true });
		const paymentsQuery = await supabase.from('payments').select('amount');

		const professionals = professionalsCount.count ?? 0;
		const bookings = bookingsCount.count ?? 0;
		const paymentsData = paymentsQuery.data ?? [] as Array<{ amount?: number }>;
		const payments = paymentsData.length;
		const totalRevenue = paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0);

		res.json({ users, professionals, bookings, payments, totalRevenue });
	} catch (e: any) {
		console.error('[api/admin/stats] Failed to fetch stats', e);
		const message = e?.message === 'Missing Supabase configuration' ? e.message : 'Failed to fetch stats';
		res.status(500).json({ error: message });
	}
}