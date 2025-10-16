import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

export const metadata = {
  title: 'Client dashboard — FixEasy'
}

const bookings = [
  {
    id: 'BK-2410',
    service: 'Heat pump servicing',
    scheduledFor: '2024-10-22T09:00:00Z',
    status: 'Confirmed'
  },
  {
    id: 'BK-2398',
    service: 'EV charger install',
    scheduledFor: '2024-09-28T13:30:00Z',
    status: 'Completed'
  }
]

export default function ClientDashboard() {
  return (
    <>
      <Navbar />
      <main>
        <section>
          <div className="container">
            <div className="card">
              <h1>Welcome back</h1>
              <p>Every booking is tracked with immutable audit logs and secure messaging.</p>
              <table className="table" style={{ marginTop: '2rem' }}>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Service</th>
                    <th>Scheduled</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.service}</td>
                      <td>{new Date(booking.scheduledFor).toLocaleString('en-IE')}</td>
                      <td>
                        <span className="status-pill">{booking.status}</span>
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
