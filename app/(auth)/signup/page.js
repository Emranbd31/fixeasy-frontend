import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import OAuthButtons from '../../../components/OAuthButtons'

export const metadata = {
  title: 'Create a FixEasy account'
}

export default function SignupLanding() {

  return (
    <>
      <Navbar />
      <main>
        <section>
          <div className="container">
            <div className="card">
              <h1>How would you like to join FixEasy?</h1>
              <p>Choose the portal you need. Every account is protected with MFA and device binding.</p>
              <div className="grid grid-2" style={{ marginTop: '2rem' }}>
                <div className="card" style={{ background: '#f8fafc' }}>
                  <h3>Client</h3>
                  <p>Book vetted professionals, manage addresses, and pay securely.</p>
                  <Link className="btn btn-primary" href="/signup/client">
                    Continue as client
                  </Link>
                </div>
                <div className="card" style={{ background: '#f8fafc' }}>
                  <h3>Professional</h3>
                  <p>Complete compliance onboarding, receive payouts, and manage your schedule.</p>
                  <Link className="btn btn-primary" href="/signup/pro">
                    Continue as professional
                  </Link>
                </div>
              </div>
              <OAuthButtons />
              <p>Prefer passwordless? Request a one-time link via the support team.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
