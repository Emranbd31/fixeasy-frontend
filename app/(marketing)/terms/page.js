import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { TERMS } from '../../../data/terms'

export const metadata = {
  title: 'Terms & Conditions — FixEasy'
}

export default function TermsPage() {
  const latest = TERMS[TERMS.length - 1]
  return (
    <>
      <Navbar />
      <main>
        <section>
          <div className="container">
            <article className="card">
              <header>
                <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b' }}>Legal</p>
                <h1>Terms &amp; Conditions</h1>
                <p>Version {latest.version} · Published {new Date(latest.publishedAt).toLocaleDateString('en-IE')}</p>
              </header>
              <div style={{ marginTop: '2rem' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.6 }}>{latest.content}</pre>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
