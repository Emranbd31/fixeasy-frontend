'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const linkBaseClass = isHome
    ? 'text-white hover:text-cyan-300 transition-colors font-medium text-sm'
    : 'text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm';

  const badgeClass = isHome
    ? 'bg-white/10 text-white border-white/10'
    : 'bg-slate-100 text-slate-700 border-slate-200';

  const iconClass = isHome ? 'text-white hover:text-cyan-300' : 'text-slate-700 hover:text-blue-600';

  const headerBase = isHome
    ? 'bg-transparent border-b border-white/10 shadow-none text-white'
    : 'bg-white/95 border-b border-slate-200 shadow-sm text-slate-800';

  return (
    <header className={['sticky top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors', headerBase].join(' ')}>
      <nav className="container mx-auto px-4 lg:px-6 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-2xl font-bold"
            >
              <span className="text-3xl">🛠️</span>
              {isHome ? (
                <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">FixEasy</span>
              ) : (
                <span className="text-slate-900">FixEasy</span>
              )}
            </motion.div>
          </Link>

          {/* Center Badge (desktop only) */}
          <div className="hidden md:flex flex-1 justify-center">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm whitespace-nowrap ${badgeClass}`}>
              🏆 Ireland&apos;s #1 Home Service Platform
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className={linkBaseClass}>
              Services
            </Link>
            <Link href="/#how-it-works" className={linkBaseClass}>
              How It Works
            </Link>
            <Link href="/login" className={linkBaseClass}>
              Login
            </Link>
            <Link href="/signup" className={linkBaseClass}>
              Sign Up
            </Link>
            <Link href="/book">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(59, 130, 246, 0.35)' }}
                whileTap={{ scale: 0.95 }}
                className="px-7 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg shadow-blue-600/30 transition-all text-sm"
              >
                Book Now
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${iconClass}`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pt-4 pb-3 space-y-3 border-t border-gray-200 mt-4 bg-white/95"
          >
            <Link href="/#services" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">
              Services
            </Link>
            <Link href="/#how-it-works" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">
              How It Works
            </Link>
            <Link href="/login" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">
              Login
            </Link>
            <Link href="/signup" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">
              Sign Up
            </Link>
            <Link href="/book" className="block">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg">
                Book Now
              </button>
            </Link>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
