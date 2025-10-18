const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const STORAGE_KEY = 'supabase.auth.token'

function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

function buildHeaders() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  }
}

export function ensureSupabaseConfig() {
  if (!isConfigured()) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }
}

export function launchOAuthSignIn(provider, redirectTo) {
  ensureSupabaseConfig()
  if (typeof window === 'undefined') return
  const authUrl = new URL(`${SUPABASE_URL}/auth/v1/authorize`)
  authUrl.searchParams.set('provider', provider)
  authUrl.searchParams.set('redirect_to', redirectTo)
  authUrl.searchParams.set('scope', 'email openid profile')
  window.location.href = authUrl.toString()
}

export async function requestMagicLink(email, redirectTo) {
  ensureSupabaseConfig()
  const response = await fetch(`${SUPABASE_URL}/auth/v1/magiclink`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      email,
      options: {
        email_redirect_to: redirectTo,
        should_create_user: true
      }
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.error_description || error?.message || 'Could not send the magic link.')
  }
}

export async function requestPhoneOtp(phone) {
  ensureSupabaseConfig()
  const response = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      phone,
      create_user: true
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.error_description || error?.message || 'Could not send the verification code.')
  }
}

export async function verifyPhoneOtp(phone, token) {
  ensureSupabaseConfig()
  const response = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      phone,
      token,
      type: 'sms'
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.error_description || error?.message || 'The verification code is invalid or expired.')
  }

  const data = await response.json().catch(() => ({}))
  persistSupabaseSession(data)
  return data
}

export function persistSupabaseSession(session) {
  if (typeof window === 'undefined' || !session) return
  const expiresIn = Number(session.expires_in) || 3600
  const expiresAt = Number(session.expires_at) || Math.round(Date.now() / 1000) + expiresIn
  const payload = {
    currentSession: {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      token_type: session.token_type,
      expires_in: expiresIn,
      expires_at: expiresAt,
      provider_token: session.provider_token ?? null
    },
    expires_at: expiresAt,
    currentUser: session.user ?? null
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (error) {
    console.warn('Unable to persist Supabase session:', error)
  }
}

export function persistSessionFromHash(hash) {
  if (typeof window === 'undefined') return null
  const value = hash || window.location.hash
  if (!value) return null

  const params = new URLSearchParams(value.replace(/^#/, ''))
  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')
  if (!accessToken || !refreshToken) return null

  const expiresIn = Number(params.get('expires_in')) || 3600
  const tokenType = params.get('token_type') || 'bearer'
  const providerToken = params.get('provider_token') || null

  const session = {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: tokenType,
    expires_in: expiresIn,
    provider_token: providerToken
  }

  persistSupabaseSession(session)
  return session
}

export function getSupabaseConfig() {
  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    isConfigured: isConfigured()
  }
}
