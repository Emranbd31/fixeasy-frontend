import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
	const { proId } = req.body;
	if (!proId) return res.status(400).json({ error: 'Missing proId' });
	const { error } = await supabase
		.from('professionals')
		.update({ status: 'approved' })
		.eq('id', proId);
	if (error) return res.status(500).json({ error: error.message });
	res.json({ ok: true });
}