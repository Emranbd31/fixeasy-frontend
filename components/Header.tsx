'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { fxTransition } from '@/lib/utils';
import { useSupabaseAuthState, useSupabaseClient } from '@/app/providers';
import { FxButton } from '@/components/ui/FxButton';

const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Professionals', href: '#professionals' },
  { label: 'Help', href: '#help' },
];

export function Header(): JSX.Element {
  const { session } = useSupabaseAuthState();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={fxTransition}
      className="sticky top-0 z-40 w-full backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" aria-label="FixEasy home">
            <Image src="/logo.svg" alt="FixEasy" width={36} height={36} className="h-9 w-9" />
            <span className="hidden text-lg font-semibold text-white sm:inline">FixEasy</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-white/70 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative transition-colors duration-300 hover:text-white"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-smooth group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <FxButton
              variant="ghost"
              onClick={handleSignOut}
              aria-label="Sign out of FixEasy"
              className="text-sm font-medium text-white/80"
            >
              Sign out
            </FxButton>
          ) : (
            <FxButton
              variant="ghost"
              href="/login"
              aria-label="Sign in to FixEasy"
              className="text-sm font-medium text-white/80"
            >
              Sign in
            </FxButton>
          )}
          <FxButton href="/book" aria-label="Book a FixEasy service">
            Book a service
          </FxButton>
        </div>
      </div>
    </motion.header>
  );
}
