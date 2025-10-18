import Head from 'next/head'

const cards = [
  {
    title: 'Client account',
    description:
      'Book vetted professionals, manage appointments, and access invoices from any device with MFA security.',
    href: '/signup/client'
  },
  {
    title: 'Professional account',
    description:
      'Complete compliance onboarding, connect Stripe payouts, and receive job offers in your preferred areas.',
    href: '/signup/pro'
  }
]

const providerRedirects = {
  google: process.env.NEXT_PUBLIC_OAUTH_GOOGLE_URL || '/api/auth/oauth/google',
  apple: process.env.NEXT_PUBLIC_OAUTH_APPLE_URL || '/api/auth/oauth/apple'
}

const providerIcons = {
  google: (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="signup-landing__oauth-icon">
      <path
        fill="#4285F4"
        d="M23.52 12.273c0-.851-.076-1.67-.217-2.455H12v4.64h6.46a5.522 5.522 0 0 1-2.397 3.622v3.01h3.874c2.267-2.086 3.583-5.164 3.583-8.817"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.957-1.075 7.943-2.91l-3.874-3.01c-1.075.721-2.45 1.148-4.069 1.148-3.13 0-5.783-2.114-6.735-4.958H1.243v3.11A11.997 11.997 0 0 0 12 24"
      />
      <path
        fill="#FBBC05"
        d="M5.265 14.27A7.2 7.2 0 0 1 4.889 12c0-.79.136-1.555.376-2.27V6.62H1.243A11.997 11.997 0 0 0 0 12c0 1.938.463 3.768 1.243 5.38l4.022-3.11"
      />
      <path
        fill="#EA4335"
        d="M12 4.772c1.761 0 3.342.606 4.587 1.794l3.441-3.441C17.952 1.13 15.236 0 12 0 7.347 0 3.29 2.693 1.243 6.62l4.022 3.11C6.217 6.886 8.87 4.772 12 4.772"
      />
    </svg>
  ),
  apple: (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="signup-landing__oauth-icon">
      <path
        fill="currentColor"
        d="M18.71 13.35c-.03-3.04 2.48-4.5 2.6-4.57-1.42-2.07-3.63-2.35-4.4-2.39-1.87-.19-3.64 1.1-4.58 1.1-.96 0-2.41-1.07-3.97-1.04-2.04.03-3.93 1.18-4.98 3-2.14 3.71-.55 9.21 1.54 12.24 1.02 1.47 2.23 3.11 3.81 3.05 1.53-.06 2.11-.99 3.96-.99 1.85 0 2.38.99 3.98.95 1.64-.03 2.68-1.49 3.68-2.98 1.15-1.69 1.62-3.34 1.65-3.43-.04-.02-3.17-1.22-3.2-4.94M15.63 4.24c.83-1 1.39-2.4 1.24-3.79-1.2.05-2.65.81-3.51 1.81-.77.9-1.44 2.32-1.26 3.68 1.32.1 2.68-.67 3.53-1.7"
      />
    </svg>
  )
}

const redirectToProvider = (provider) => {
  const target = providerRedirects[provider]
  if (!target) {
    console.warn(`No OAuth redirect configured for provider: ${provider}`)
    return
  }

  if (typeof window !== 'undefined') {
    window.location.href = target
  }
}

export default function SignupIndexPage() {
  return (
    <>
      <Head>
        <title>Create your FixEasy account</title>
        <meta
          name="description"
          content="Choose a FixEasy client or professional account to start booking or delivering trusted services."
        />
      </Head>
      <main className="signup-landing">
        <section className="signup-landing__container" aria-labelledby="signup-landing-title">
          <header className="signup-landing__header">
            <span className="signup-landing__eyebrow">Start with FixEasy</span>
            <h1 id="signup-landing-title">Create your FixEasy account</h1>
            <p>
              Choose the workflow that suits you — clients unlock guided bookings and live support, while professionals join a
              vetted network with verified payouts and job alerts.
            </p>
          </header>

          <div className="signup-landing__actions">
            <div className="signup-landing__oauth" aria-label="Continue with a single sign-on provider">
              <button
                type="button"
                onClick={() => redirectToProvider('google')}
                className="signup-landing__oauth-btn signup-landing__oauth-btn--google"
              >
                {providerIcons.google}
                <span>Continue with Google</span>
              </button>
              <button
                type="button"
                onClick={() => redirectToProvider('apple')}
                className="signup-landing__oauth-btn signup-landing__oauth-btn--apple"
              >
                {providerIcons.apple}
                <span>Continue with Apple</span>
              </button>
            </div>

            <div className="signup-landing__divider" role="separator" aria-label="Continue with email">
              <span>or continue with email</span>
            </div>

            <div className="signup-landing__cards" role="list">
              {cards.map((card) => (
                <a key={card.title} href={card.href} className="signup-landing__card" role="listitem">
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                  <span aria-hidden="true">Continue &rarr;</span>
                </a>
              ))}
            </div>
          </div>

          <p className="signup-landing__mfa" role="note">
            Every FixEasy account supports secure multi-factor authentication to protect your bookings and payouts.
          </p>
        </section>
      </main>
    </>
  )
}
