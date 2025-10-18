const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`
}

export const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

const roleStateParam = (role) => {
  if (!role) return {}
  return { state: role }
}

export const roleRedirectMap = {
  client: '/dashboard/client',
  pro: '/dashboard/pro',
  admin: '/dashboard/admin'
}

export function startOAuth(provider, role) {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase Auth is not configured.')
  }
  if (typeof window === 'undefined') {
    throw new Error('Supabase OAuth is only available in the browser.')
  }

  const redirectPath = roleRedirectMap[role] || '/dashboard/client'
  const params = new URLSearchParams({
    provider,
    redirect_to: `${window.location.origin}${redirectPath}`,
    ...roleStateParam(role)
  })

  window.localStorage.setItem('fixeasy_role', role)
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?${params.toString()}`
}

export async function signInWithMagicLink(email, role) {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase Auth is not configured.')
  }
  if (typeof window === 'undefined') {
    throw new Error('Supabase Auth is only available in the browser.')
  }

  const redirectPath = roleRedirectMap[role] || '/dashboard/client'
  const response = await fetch(`${SUPABASE_URL}/auth/v1/magiclink`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({
      email,
      redirect_to: `${window.location.origin}${redirectPath}`
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.msg || 'Could not send magic link. Try again shortly.')
  }

  window.localStorage.setItem('fixeasy_role', role)
}

export async function requestPhoneOtp(phone, role) {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase Auth is not configured.')
  }
  if (typeof window === 'undefined') {
    throw new Error('Supabase Auth is only available in the browser.')
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ phone, type: 'sms', create_user: true })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.msg || 'Could not send verification code.')
  }

  window.localStorage.setItem('fixeasy_role', role)
}

export async function verifyPhoneOtp(phone, token, role) {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase Auth is not configured.')
  }
  if (typeof window === 'undefined') {
    throw new Error('Supabase Auth is only available in the browser.')
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ phone, token, type: 'sms' })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.msg || 'Verification failed. Check the code and try again.')
  }

  window.localStorage.setItem('fixeasy_role', role)

  const redirectPath = roleRedirectMap[role] || '/dashboard/client'
  window.location.href = redirectPath
}
