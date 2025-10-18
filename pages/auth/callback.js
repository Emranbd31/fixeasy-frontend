import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { clearSupabaseOAuthState, exchangeSupabaseCode } from '../../lib/oauth'

function getStoredItem(key) {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(key)
}

export default function SupabaseAuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Processing your FixEasy login…')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!router.isReady) return

    const { code, state, error: authError, error_description: errorDescription } = router.query

    if (authError || errorDescription) {
      setError((authError || errorDescription)?.toString() || 'We were unable to complete the sign-in.')
      setStatus('')
      return
    }

    if (typeof code !== 'string' || !code) {
      setError('Missing OAuth code. Restart the login flow.')
      setStatus('')
      return
    }

    const storedState = getStoredItem('fixeasy_oauth_state')
    const storedVerifier = getStoredItem('fixeasy_oauth_verifier')
    const target = getStoredItem('fixeasy_oauth_target') || 'client'

    if (!storedState || !storedVerifier) {
      setError('Your session expired. Please start the login again.')
      setStatus('')
      return
    }

    if (typeof state !== 'string' || state !== storedState) {
      setError('State mismatch detected. Please restart the login flow.')
      setStatus('')
      clearSupabaseOAuthState()
      return
    }

    const redirectUri = `${window.location.origin}/auth/callback`

    async function finishLogin() {
      try {
        const tokens = await exchangeSupabaseCode({ code, codeVerifier: storedVerifier, redirectUri })
        localStorage.setItem('fixeasy.supabase.session', JSON.stringify({ ...tokens, storedAt: Date.now() }))
        setStatus('Signed in successfully. Redirecting…')
      } catch (tokenError) {
        console.error('Supabase OAuth exchange failed', tokenError)
        setError(tokenError.message || 'We were unable to finish signing you in.')
        setStatus('')
        return
      } finally {
        clearSupabaseOAuthState()
      }

      const destination = target === 'pro' ? '/dashboard/pro' : '/dashboard/client'
      router.replace({ pathname: destination, query: { from: 'oauth' } })
    }

    finishLogin()
  }, [router])

  return (
    <div className="auth-callback">
      <Head>
        <title>Signing you in — FixEasy</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="auth-callback__container">
        <div className="auth-callback__card">
          <div className="auth-callback__loader" aria-hidden="true" />
          <h1>Hold tight…</h1>
          {status ? <p>{status}</p> : null}
          {error ? <p role="alert" className="auth-callback__error">{error}</p> : null}
          {error ? (
            <button
              type="button"
              className="auth-callback__button"
              onClick={() => router.replace('/signup')}
            >
              Back to sign in options
            </button>
          ) : null}
        </div>
      </main>
    </div>
  )
}
