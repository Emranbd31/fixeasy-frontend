import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { GetServerSidePropsContext } from 'next';
import type { CookieOptions } from '@supabase/auth-helpers-shared';

const cookieOptions: Partial<CookieOptions> = {
  name: 'fixeasy-auth',
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7,
};

type ServerContext =
  | { req: NextApiRequest; res: NextApiResponse }
  | Pick<GetServerSidePropsContext, 'req' | 'res'>;

export function getSupabaseServerClient(ctx: ServerContext): SupabaseClient {
  return createServerSupabaseClient({
    req: ctx.req,
    res: ctx.res,
    cookieOptions,
  });
}
