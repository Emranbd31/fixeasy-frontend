'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm">
      <nav className="container mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-2xl font-bold"
            >
              <span className="text-3xl">🛠️</span>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                FixEasy
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
              Services
            </Link>
            <Link href="/#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
              How It Works
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
              Login
            </Link>
            <LanguageSwitcher />
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
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
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
            className="md:hidden pt-4 pb-3 space-y-3 border-t border-gray-200 mt-4"
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
            <div className="py-2">
              <LanguageSwitcher />
            </div>
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
