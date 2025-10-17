import Head from 'next/head'
import Link from 'next/link'

export default function Forbidden() {
  return (
    <div className="error-page">
      <Head>
        <title>403 — Access denied</title>
      </Head>
      <div className="error-page__card">
        <h1>Access denied</h1>
        <p>You do not have permission to view this page.</p>
        <Link href="/" className="error-page__link">
          Return to homepage
        </Link>
      </div>
    </div>
  )
}
