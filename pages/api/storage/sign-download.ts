import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServerClient } from '../../../lib/supabaseServer';
import { verifyCsrfToken } from '../../../lib/csrf';

const backendUrl = process.env.FIXEASY_API_URL ?? 'http://localhost:8000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = getSupabaseServerClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (!verifyCsrfToken(req)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  try {
    const response = await fetch(`${backendUrl}/storage/sign-download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json().catch(() => ({}));
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Storage service unavailable' });
  }
}
