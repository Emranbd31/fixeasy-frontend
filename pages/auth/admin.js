import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const ADMIN_DOMAIN = '@fixeasy.irish'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch('/api/auth/admin/session')
        if (response.ok) {
          const currentQuery = router.asPath.includes('?') ? router.asPath.split('?')[1] : ''
          const searchParams = new URLSearchParams(currentQuery)
          const redirect = searchParams.get('redirect') ?? '/dashboard/admin'
          router.replace(redirect)
        }
      } catch (sessionError) {
        console.warn('Session check failed', sessionError)
      }
    }

    verifySession()
  }, [router])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail.toLowerCase().endsWith(ADMIN_DOMAIN)) {
      setError('Use your @fixeasy.irish email to sign in.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password })
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error ?? 'Unable to authenticate. Try again shortly.')
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('fixeasy_role', 'admin')
      }

      const redirect = typeof router.query.redirect === 'string' ? router.query.redirect : '/dashboard/admin'
      router.replace(redirect)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <Head>
        <title>FixEasy Admin Access</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="admin-login__card" role="form">
        <h1>Secure admin access</h1>
        <p>Only FixEasy staff with verified @fixeasy.irish accounts may continue.</p>

        {error ? (
          <div className="admin-login__error" role="alert">
            {error}
          </div>
        ) : null}

        <form className="admin-login__form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@fixeasy.irish"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />

          <button type="submit" className="admin-login__submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Signing in…' : 'Sign in securely'}
          </button>
        </form>
      </div>
    </div>
  )
}
