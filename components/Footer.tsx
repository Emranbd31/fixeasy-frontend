import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              FixEasy
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Professional home services at your fingertips. Fast, reliable, and affordable.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/book" className="hover:text-white transition-colors">Cleaning</Link></li>
              <li><Link href="/book" className="hover:text-white transition-colors">Handyman</Link></li>
              <li><Link href="/book" className="hover:text-white transition-colors">Plumbing</Link></li>
              <li><Link href="/book" className="hover:text-white transition-colors">Electrical</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/pro/register" className="hover:text-white transition-colors">Become a Pro</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Ireland</li>
              <li>support@fixeasy.irish</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 FixEasy. All rights reserved. IRELAND</p>
        </div>
      </div>
    </footer>
  );
}
