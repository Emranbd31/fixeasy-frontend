import Head from 'next/head'
import { getLatestTerms } from '../lib/terms'

export default function TermsPage({ terms }) {
  return (
    <>
      <Head>
        <title>FixEasy Terms & Conditions</title>
        <meta
          name="description"
          content={`Review FixEasy Terms & Conditions version ${terms.version} effective ${terms.effectiveDate}.`}
        />
      </Head>
      <main className="legal-page">
        <header className="legal-hero">
          <h1>Terms &amp; Conditions</h1>
          <p>
            Version {terms.version} &middot; Effective {new Date(terms.effectiveDate).toLocaleDateString('en-IE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </header>
        <article className="legal-content" dangerouslySetInnerHTML={{ __html: terms.contentHtml }} />
      </main>
    </>
  )
}

export function getStaticProps() {
  const terms = getLatestTerms()
  return {
    props: {
      terms
    }
  }
}
