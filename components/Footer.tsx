import Link from 'next/link';

import { Github, Linkedin, Twitter } from 'lucide-react';

const footerLinks = [
  { label: 'Services', href: '/#services' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Help', href: '/#help' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
];

export function Footer(): JSX.Element {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 text-sm text-white/75 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Footer links">
            {footerLinks.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-4" aria-label="Social links">
            <Link href="https://twitter.com" aria-label="FixEasy on Twitter" className="text-white/60 transition hover:text-white">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="https://www.linkedin.com" aria-label="FixEasy on LinkedIn" className="text-white/60 transition hover:text-white">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="https://github.com" aria-label="FixEasy on GitHub" className="text-white/60 transition hover:text-white">
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} FixEasy. All rights reserved.</span>
          <span className="uppercase tracking-[0.35em] text-white/45">Ireland</span>
        </div>
      </div>
    </footer>
  );
}
