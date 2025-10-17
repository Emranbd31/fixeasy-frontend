import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { useUser } from '../contexts/UserContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
]

export function NavBar() {
  const { user } = useUser()
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const primaryCta = user ? { href: '/dashboard/client', label: 'Dashboard' } : { href: '/login', label: 'Login' }

  const handleToggleTheme = () => {
    const currentTheme = theme === 'system' ? resolvedTheme : theme
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }

  const handleNavClick = async (href) => {
    setOpen(false)
    await router.push(href)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur dark:bg-slate-950/80">
      <div className="gradient-divider" />
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="rounded-full bg-gradient-to-r from-brand to-accent-cyan p-2 text-white shadow-brand-card">
            FX
          </span>
          <span className="hidden text-lg tracking-tight text-slate-900 dark:text-slate-100 sm:block">FixEasy</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="relative transition-colors duration-300 hover:text-slate-900 dark:hover:text-white">
              {router.asPath === link.href && (
                <motion.span
                  layoutId="navbar-active"
                  className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-brand to-accent-cyan"
                />
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Toggle theme"
            className="rounded-full border border-slate-200/60 bg-white/70 p-2 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:text-brand dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-accent-cyan"
          >
            {(theme === 'system' ? resolvedTheme : theme) === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <Link
            href={primaryCta.href}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-brand to-accent-cyan px-5 py-2 text-sm font-semibold text-white shadow-brand-card transition-transform duration-300 hover:-translate-y-0.5"
          >
            {primaryCta.label}
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full border border-slate-200/60 bg-white/70 p-2 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:text-brand dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200/60 bg-white/90 px-6 py-4 shadow-brand-soft dark:border-slate-800 dark:bg-slate-900/90 lg:hidden"
          >
            <ul className="space-y-3 text-sm font-medium text-slate-700 dark:text-slate-200">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    className="w-full text-left transition-colors duration-200 hover:text-brand"
                    onClick={() => handleNavClick(link.href)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={handleToggleTheme}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 px-4 py-2 text-sm font-semibold text-slate-600 transition-all duration-300 hover:border-brand hover:text-brand dark:border-slate-800 dark:text-slate-200"
              >
                {(theme === 'system' ? resolvedTheme : theme) === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {(theme === 'system' ? resolvedTheme : theme) === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <Link
                href={primaryCta.href}
                className="inline-flex items-center rounded-full bg-gradient-to-r from-brand to-accent-cyan px-4 py-2 text-sm font-semibold text-white shadow-brand-card"
                onClick={() => setOpen(false)}
              >
                {primaryCta.label}
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
