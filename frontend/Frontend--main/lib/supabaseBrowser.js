import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

let browserClient = null

const cookieOptions = {
  name: 'fixeasy-auth',
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7,
}

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserSupabaseClient({
      cookieOptions,
    })
  }
  return browserClient
}
