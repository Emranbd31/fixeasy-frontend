import Head from 'next/head'
import { getLatestTerms } from '../lib/terms'

export default function TermsPage({ terms }) {
  const lastUpdatedSuffix = terms.formattedLastUpdated
    ? ` Last updated ${terms.formattedLastUpdated}.`
    : ''

  return (
    <>
      <Head>
        <title>FixEasy Terms & Conditions</title>
        <meta
          name="description"
          content={`Review FixEasy Terms & Conditions version ${terms.version} effective ${terms.formattedEffectiveDate}.${lastUpdatedSuffix}`}
        />
      </Head>
      <main className="legal-page">
        <header className="legal-hero">
          <h1>Terms &amp; Conditions</h1>
          <p>
            Version {terms.version} &middot; Effective {terms.formattedEffectiveDate}
            {terms.formattedLastUpdated ? ` · Last updated ${terms.formattedLastUpdated}` : ''}
          </p>
        </header>
        <article className="legal-content" dangerouslySetInnerHTML={{ __html: terms.contentHtml }} />
      </main>
    </>
  )
}

export function getStaticProps() {
  const terms = getLatestTerms()
  const formatDate = (value) => {
    if (!value) return ''
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return value
    }
    return parsed.toLocaleDateString('en-IE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formattedEffectiveDate = formatDate(terms.effectiveDate)
  const formattedLastUpdated = formatDate(terms.lastUpdated ?? terms.effectiveDate)
  return {
    props: {
      terms: {
        ...terms,
        formattedEffectiveDate,
        formattedLastUpdated
      }
    }
  }
}
