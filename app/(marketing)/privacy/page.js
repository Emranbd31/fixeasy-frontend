import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

export const metadata = {
  title: 'Privacy policy — FixEasy'
}

const sections = [
  {
    title: 'Data controllers',
    copy: 'FixEasy Operations Ltd (Dublin) is the controller for client and professional records.'
  },
  {
    title: 'What we collect',
    copy: 'Identity documents, contact details, service preferences, and audit trails for security. Documents are encrypted in Supabase Storage.'
  },
  {
    title: 'How we use data',
    copy: 'Deliver bookings, process payments, enforce security controls, and meet regulatory obligations. We do not sell personal data.'
  },
  {
    title: 'Your rights',
    copy: 'Submit GDPR data subject requests at privacy@fixeasy.ie for access, rectification, or deletion.'
  }
]

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section>
          <div className="container">
            <article className="card">
              <h1>Privacy policy</h1>
              <p>We operate with GDPR by design and zero trust principles across every workflow.</p>
              <div className="grid" style={{ gap: '1.5rem', marginTop: '2rem' }}>
                {sections.map((section) => (
                  <div key={section.title}>
                    <h3>{section.title}</h3>
                    <p>{section.copy}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
