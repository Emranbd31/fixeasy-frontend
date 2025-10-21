import type { Metadata } from 'next';

import '@/styles/globals.css';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SupabaseProvider } from './providers';

export const metadata: Metadata = {
  title: 'FixEasy — Trusted home services in minutes',
  description:
    'Book vetted home service professionals anywhere in Ireland. Transparent pricing, premium support and Apple/Google login ready.',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[color:var(--fx-slate-1)] text-white">
        <SupabaseProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-24 pt-4">{children}</main>
            <Footer />
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
