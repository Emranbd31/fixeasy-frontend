import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { requireAdminAuth } from '@/lib/adminAuth';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
	try {
		await requireAdminAuth(req);
	} catch (error: any) {
		return res.status(error.status ?? 401).json({ error: error.message ?? 'Unauthorized' });
	}
	const { userId, active } = req.body;
	if (!userId || typeof active !== 'boolean') return res.status(400).json({ error: 'Missing userId or active' });
	const { error } = await supabase
		.from('profiles')
		.update({ active })
		.eq('id', userId);
	if (error) return res.status(500).json({ error: error.message });
	res.json({ ok: true });
}