import { sanitizeText } from '../../../lib/validation'

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function error(message, field) {
  return { ok: false, error: message, field }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json(error('Method not allowed.'))
  }

  const { fileName, contentType, bucket = 'client-uploads' } = req.body ?? {}

  if (!sanitizeText(fileName)) {
    return res.status(400).json(error('Provide a filename to reserve in storage.', 'fileName'))
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(501).json(
      error('Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable uploads.')
    )
  }

  const safeName = sanitizeText(fileName).replace(/[^a-zA-Z0-9.\-]/g, '_') || `upload-${Date.now()}`
  const objectPath = `service-issues/${Date.now()}-${safeName}`

  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}`

  return res.status(200).json({
    ok: true,
    path: objectPath,
    uploadUrl,
    instructions:
      'Use a server-side request with the service role key to upload the binary payload to Supabase Storage at the provided URL.'
  })
}
