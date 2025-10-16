import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { TERMS } from '../../../data/terms'
import { getStore } from '../../../lib/memory-store'

export const metadata = {
  title: 'Admin — FixEasy'
}

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  const store = getStore()
  const latestTerms = TERMS[TERMS.length - 1]
  const pendingProfessionals = store.professionals.filter((pro) => pro.kycStatus !== 'verified')

  return (
    <>
      <Navbar />
      <main>
        <section>
          <div className="container">
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h1>Compliance overview</h1>
              <p>
                Latest Terms version <strong>{latestTerms.version}</strong> published{' '}
                {new Date(latestTerms.publishedAt).toLocaleDateString('en-IE')}.
              </p>
              <p>Pending acceptance prompts will appear for users the next time they log in.</p>
            </div>
            <div className="card">
              <h2>Professionals pending KYC</h2>
              {pendingProfessionals.length === 0 ? (
                <p>All professionals verified 🎉</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Categories</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProfessionals.map((pro) => (
                      <tr key={pro.id}>
                        <td>{pro.reference}</td>
                        <td>{pro.fullName}</td>
                        <td>{pro.email}</td>
                        <td>{pro.categories.join(', ')}</td>
                        <td>
                          <span className="status-pill">{pro.kycStatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
