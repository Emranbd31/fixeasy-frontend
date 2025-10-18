import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { persistSessionFromHash } from '../../lib/supabaseClient'

const ROLE_REDIRECTS = {
  client: '/dashboard/client',
  pro: '/dashboard/pro',
  admin: '/dashboard/admin'
}

function resolveRole(queryRole) {
  if (typeof queryRole !== 'string') return 'client'
  if (queryRole === 'pro' || queryRole === 'admin') return queryRole
  return 'client'
}

export default function SupabaseRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    const role = resolveRole(router.query.role)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fixeasy_role', role)
      persistSessionFromHash(window.location.hash)
      const destination = ROLE_REDIRECTS[role] || ROLE_REDIRECTS.client
      window.location.replace(destination)
    }
  }, [router])

  return (
    <div className="auth-redirect">
      <Head>
        <title>FixEasy — Completing sign-in</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="auth-redirect__body">
        <div className="auth-redirect__card">
          <span className="auth-redirect__spinner" aria-hidden="true" />
          <p>Finishing your secure FixEasy sign-in…</p>
        </div>
      </main>
    </div>
  )
}
