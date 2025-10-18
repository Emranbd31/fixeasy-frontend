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

const WORK_ENV_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    alt: 'FixEasy electrician wiring a panel'
  },
  {
    src: 'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?auto=format&fit=crop&w=800&q=80',
    alt: 'Professional cleaner preparing equipment'
  },
  {
    src: 'https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=800&q=80',
    alt: 'Gardening crew maintaining a landscaped garden'
  },
  {
    src: 'https://images.unsplash.com/photo-1523419409543-0f1a97ed8c68?auto=format&fit=crop&w=800&q=80',
    alt: 'Carpenter measuring cabinetry installation'
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
        <section className="signup-index__hero">
          <div className="signup-index__copy">
            <span className="signup-index__eyebrow">Start with FixEasy</span>
            <h1>Create your FixEasy account</h1>
            <p>
              Choose the workflow that suits you — clients unlock guided bookings and live support, while professionals join a
              vetted network with verified payouts and job alerts.
            </p>
          </div>
          <div className="signup-index__gallery" aria-hidden="true">
            {WORK_ENV_IMAGES.map((image, index) => (
              <figure key={`${image.src}-${index}`} className="signup-index__gallery-item">
                <img src={image.src} alt="" />
                <figcaption>{image.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
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
