import { decodeSession, SESSION_COOKIE } from '../../../../lib/admin-session'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const sessionCookie = req.cookies?.[SESSION_COOKIE]
  const session = decodeSession(sessionCookie)

  if (!session) {
    return res.status(401).json({ ok: false, error: 'Not authenticated' })
  }

  return res.status(200).json({ ok: true, session })
}
