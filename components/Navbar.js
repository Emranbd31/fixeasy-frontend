import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="logo" aria-label="FixEasy home">
          <strong>FixEasy</strong>
        </Link>
        <nav className="site-nav">
          <Link href="/signup">Sign up</Link>
          <Link href="/dashboard">Client portal</Link>
          <Link href="/dashboard/pro">Professional portal</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
