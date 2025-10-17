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
      <main className="signup-index">
        <header className="signup-index__hero">
          <h1>Create your FixEasy account</h1>
          <p>Select the experience that matches how you use FixEasy.</p>
        </header>
        <section className="signup-index__grid">
          {cards.map((card) => (
            <a key={card.title} href={card.href} className="signup-index__card">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <span aria-hidden="true">Continue &rarr;</span>
            </a>
          ))}
        </section>
      </main>
    </>
  )
}
