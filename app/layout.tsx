import type { Metadata } from 'next';
import '../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'FixEasy - Home Services Made Easy',
  description: 'Connect with trusted professionals for all your home service needs. Fast, reliable, and affordable.',
  keywords: ['home services', 'handyman', 'plumbing', 'cleaning', 'Ireland'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
