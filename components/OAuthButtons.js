'use client'

async function startOAuth(provider) {
  try {
    const response = await fetch(`/api/auth/oauth/${provider}`, { method: 'POST' })
    const data = await response.json()
    if (data?.redirectUrl) {
      window.location.href = data.redirectUrl
    }
  } catch (error) {
    console.error('OAuth initiation failed', error)
  }
}

export default function OAuthButtons() {
  return (
    <div className="grid grid-2" style={{ margin: '1.5rem 0' }}>
      <button type="button" className="btn btn-secondary" onClick={() => startOAuth('google')}>
        Continue with Google
      </button>
      <button type="button" className="btn btn-secondary" onClick={() => startOAuth('apple')}>
        Continue with Apple
      </button>
    </div>
  )
}
