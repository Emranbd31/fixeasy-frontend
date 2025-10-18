const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const PKCE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'

function generateRandomString(length) {
  if (typeof window === 'undefined') {
    throw new Error('OAuth flow must run in the browser.')
  }

  const array = new Uint32Array(length)
  window.crypto.getRandomValues(array)
  let output = ''
  for (let index = 0; index < length; index += 1) {
    output += PKCE_CHARACTERS[array[index] % PKCE_CHARACTERS.length]
  }
  return output
}

function base64UrlEncode(buffer) {
  if (buffer instanceof ArrayBuffer) {
    buffer = new Uint8Array(buffer)
  }

  let string = ''
  buffer.forEach((byte) => {
    string += String.fromCharCode(byte)
  })

  return btoa(string).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export async function startSupabaseOAuth(provider, target = 'client') {
  if (typeof window === 'undefined') {
    throw new Error('OAuth flow must run in the browser.')
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase OAuth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  if (!window.crypto?.subtle || !window.crypto?.getRandomValues) {
    throw new Error('Secure cryptography APIs are not available in this browser.')
  }

  const codeVerifier = generateRandomString(64)
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  const codeChallenge = base64UrlEncode(new Uint8Array(digest))

  const state = window.crypto.randomUUID ? window.crypto.randomUUID() : generateRandomString(32)
  const redirectUri = `${window.location.origin}/auth/callback`

  sessionStorage.setItem('fixeasy_oauth_state', state)
  sessionStorage.setItem('fixeasy_oauth_verifier', codeVerifier)
  sessionStorage.setItem('fixeasy_oauth_target', target)

  const authorizeUrl = new URL(`${SUPABASE_URL}/auth/v1/authorize`)
  authorizeUrl.searchParams.set('provider', provider)
  authorizeUrl.searchParams.set('redirect_to', redirectUri)
  authorizeUrl.searchParams.set('scopes', 'email profile openid')
  authorizeUrl.searchParams.set('state', state)
  authorizeUrl.searchParams.set('code_challenge', codeChallenge)
  authorizeUrl.searchParams.set('code_challenge_method', 's256')
  authorizeUrl.searchParams.set('flow_type', 'pkce')

  window.location.assign(authorizeUrl.toString())
}

export async function exchangeSupabaseCode({ code, codeVerifier, redirectUri }) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase OAuth is not configured.')
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=pkce`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ code, code_verifier: codeVerifier, redirect_to: redirectUri })
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload?.error_description || payload?.error || 'Unable to complete Supabase sign-in.')
  }

  return response.json()
}

export function clearSupabaseOAuthState() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem('fixeasy_oauth_state')
  sessionStorage.removeItem('fixeasy_oauth_verifier')
  sessionStorage.removeItem('fixeasy_oauth_target')
}

export function getSupabaseOAuthConfig() {
  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
  }
}
