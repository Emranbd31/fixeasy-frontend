import Navbar from './Navbar'
import Footer from './Footer'

export default function RegistrationLayout({ title, eyebrow, intro, children, aside }) {
  return (
    <>
      <Navbar />
      <main>
        <section>
          <div className="container">
            <header style={{ marginBottom: '2.5rem' }}>
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.85rem', color: '#64748b' }}>{eyebrow}</p>
              <h1 style={{ margin: '0.4rem 0 1rem' }}>{title}</h1>
              <p style={{ maxWidth: '42rem', fontSize: '1.05rem', color: '#475569' }}>{intro}</p>
            </header>
            <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
              <div className="card">{children}</div>
              <aside className="card" style={{ position: 'sticky', top: '6rem', alignSelf: 'start' }}>
                {aside}
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
