import Head from 'next/head'

const sections = [
  {
    title: 'Overview',
    body:
      'FixEasy collects only the personal data required to deliver trusted home services, operate secure payments, and meet our regulatory obligations in Ireland.'
  },
  {
    title: 'What we collect',
    body:
      'Contact information, booking history, verification documents, device metadata for security, and payment tokens handled by Stripe are collected on an as-needed basis.'
  },
  {
    title: 'How we use data',
    body:
      'We process data to schedule appointments, communicate status updates, pay professionals, and maintain compliance. Aggregated analytics help improve service quality.'
  },
  {
    title: 'Your rights',
    body:
      'You can submit GDPR Data Subject Requests at any time by emailing privacy@fixeasy.ie. We honour access, rectification, portability, and deletion requests within statutory timelines.'
  },
  {
    title: 'Security controls',
    body:
      'Data is encrypted in transit and at rest. Access is governed by Zero-Trust policies, MFA, and least privilege controls enforced across Supabase and Stripe.'
  }
]

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>FixEasy Privacy Policy</title>
        <meta name="description" content="Understand how FixEasy protects and processes your personal data." />
      </Head>
      <main className="legal-page">
        <header className="legal-hero">
          <h1>Privacy Policy</h1>
          <p>Effective July 2024 &middot; Dublin, Ireland</p>
        </header>
        <section className="legal-content">
          {sections.map((section) => (
            <article key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  )
}
