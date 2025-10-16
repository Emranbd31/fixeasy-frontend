import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid grid-2">
          <div>
            <strong>FixEasy</strong>
            <p>Trusted home services for Ireland with compliance-first onboarding.</p>
          </div>
          <div>
            <p>
              <Link href="/terms">Terms &amp; Conditions</Link>
            </p>
            <p>
              <Link href="/privacy">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
