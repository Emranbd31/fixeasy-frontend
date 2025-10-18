import { sanitizeText } from '../../../lib/validation'

function error(message, field) {
  return { ok: false, error: message, field }
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json(error('Method not allowed.'))
  }

  const { email, description, metadata } = req.body ?? {}

  if (!sanitizeText(email) || !/^([^\s@]+)@([^\s@]+)\.([\w-]{2,})$/.test(email)) {
    return res.status(400).json(error('Provide a valid contact email.', 'email'))
  }

  if (!sanitizeText(description)) {
    return res.status(400).json(error('Tell us about the service you want to list.', 'description'))
  }

  return res.status(202).json({
    ok: true,
    receivedAt: new Date().toISOString(),
    ticketId: `OTHER-${Date.now().toString(36).toUpperCase()}`,
    metadata: metadata && typeof metadata === 'object' ? metadata : {}
  })
}
