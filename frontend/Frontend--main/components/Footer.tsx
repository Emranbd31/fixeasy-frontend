import Link from 'next/link'

const footerLinks = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: 'https://status.fixeasy.irish', label: 'Status', external: true },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-slate-900 text-slate-100 dark:bg-slate-950">
      <div className="gradient-divider" />
      <div className="container flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-semibold">FixEasy</p>
          <p className="text-sm text-slate-400">Trusted home services across Ireland.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          {footerLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className="transition-colors duration-300 hover:text-white">
                {link.label}
              </Link>
            )
          )}
        </div>
        <p className="text-sm text-slate-500">© {currentYear} FixEasy. All rights reserved.</p>
      </div>
    </footer>
  )
}
