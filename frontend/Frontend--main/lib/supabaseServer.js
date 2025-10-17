import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const cookieOptions = {
  name: 'fixeasy-auth',
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7,
}

export function getSupabaseServerClient(ctx) {
  if (!ctx?.req || !ctx?.res) {
    throw new Error('getSupabaseServerClient requires a context with req and res properties')
  }

  return createServerSupabaseClient({
    req: ctx.req,
    res: ctx.res,
    cookieOptions,
  })
}
