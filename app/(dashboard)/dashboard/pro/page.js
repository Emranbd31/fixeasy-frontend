import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'

export const metadata = {
  title: 'Professional dashboard — FixEasy'
}

const jobs = [
  {
    id: 'JOB-5521',
    client: 'Aine Byrne',
    service: 'Emergency plumbing',
    scheduledFor: '2024-10-17T18:30:00Z',
    status: 'Awaiting acceptance'
  },
  {
    id: 'JOB-5488',
    client: 'Hassan Ali',
    service: 'Solar panel maintenance',
    scheduledFor: '2024-10-18T10:00:00Z',
    status: 'Scheduled'
  }
]

export default function ProDashboard() {
  return (
    <>
      <Navbar />
      <main>
        <section>
          <div className="container">
            <div className="card">
              <h1>Active jobs</h1>
              <p>Stripe Connect payouts and verification status are synced automatically.</p>
              <table className="table" style={{ marginTop: '2rem' }}>
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Scheduled</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.id}</td>
                      <td>{job.client}</td>
                      <td>{job.service}</td>
                      <td>{new Date(job.scheduledFor).toLocaleString('en-IE')}</td>
                      <td>
                        <span className="status-pill">{job.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
