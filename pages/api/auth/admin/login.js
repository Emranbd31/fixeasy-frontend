import { createSessionCookie } from '../../../../lib/admin-session'

const ADMIN_DOMAIN = '@fixeasy.irish'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { email, password } = req.body ?? {}
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ ok: false, error: 'Email and password are required.' })
  }

  const normalisedEmail = email.trim().toLowerCase()
  if (!normalisedEmail.endsWith(ADMIN_DOMAIN)) {
    return res.status(403).json({ ok: false, error: 'Admin access restricted to FixEasy accounts.' })
  }

  const adminPassword = process.env.ADMIN_DASHBOARD_SECRET
  if (!adminPassword) {
    return res.status(500).json({ ok: false, error: 'Admin authentication is not configured.' })
  }

  if (password !== adminPassword) {
    return res.status(401).json({ ok: false, error: 'Invalid credentials.' })
  }

  try {
    const { header, session } = await createSessionCookie(normalisedEmail)
    res.setHeader('Set-Cookie', header)
    return res.status(200).json({ ok: true, session })
  } catch (error) {
    console.error('Failed to issue admin session cookie', error)
    return res.status(500).json({ ok: false, error: 'Admin authentication is not configured.' })
  }
}
