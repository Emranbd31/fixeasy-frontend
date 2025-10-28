'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-3xl">🛠️</span>
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    FixEasy
                                </h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                                Ireland's leading home service platform. Connect with trusted professionals for all your home needs. Fast, reliable, and affordable.
                            </p>

                            {/* Social Links */}
                            <div className="flex gap-4">
                                {[
                                    { icon: '🐦', label: 'Twitter', href: 'https://twitter.com' },
                                    { icon: '📘', label: 'Facebook', href: 'https://facebook.com' },
                                    { icon: '📸', label: 'Instagram', href: 'https://instagram.com' },
                                    { icon: '💼', label: 'LinkedIn', href: 'https://linkedin.com' }
                                ].map((social, i) => (
                                    <motion.a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 rounded-xl flex items-center justify-center text-xl transition-all duration-300 shadow-lg"
                                        aria-label={social.label}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Services Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h4 className="font-bold text-lg mb-4 text-white">Popular Services</h4>
                        <ul className="space-y-3 text-gray-400">
                            {['Cleaning', 'Handyman', 'Plumbing', 'Electrical', 'Painting', 'Gardening'].map((service, i) => (
                                <li key={i}>
                                    <Link href="/book" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        {service}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h4 className="font-bold text-lg mb-4 text-white">Company</h4>
                        <ul className="space-y-3 text-gray-400">
                            {[
                                { label: 'How It Works', href: '/#how-it-works' },
                                { label: 'About Us', href: '/about' },
                                { label: 'Become a Pro', href: '/register/professional' },
                                { label: 'Careers', href: '/careers' },
                                { label: 'Blog', href: '/blog' },
                                { label: 'Help Center', href: '/help' }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h4 className="font-bold text-lg mb-4 text-white">Contact</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-lg">📍</span>
                                <span>Dublin, Ireland</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-lg">📧</span>
                                <a href="mailto:support@fixeasy.irish" className="hover:text-cyan-400 transition-colors">
                                    support@fixeasy.irish
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-lg">📞</span>
                                <a href="tel:+353" className="hover:text-cyan-400 transition-colors">
                                    +353 (0) 123 4567
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-lg">⏰</span>
                                <span>Mon-Fri: 8AM-8PM<br />Sat-Sun: 9AM-6PM</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-6 py-8 border-t border-gray-800"
                >
                    {[
                        '🛡️ Insured',
                        '✅ Verified Pros',
                        '⭐ 4.9/5 Rating',
                        '🇮🇪 Irish Owned',
                        '💳 Secure Payment'
                    ].map((badge, i) => (
                        <div key={i} className="px-4 py-2 bg-gray-800 rounded-full text-sm font-semibold text-gray-300">
                            {badge}
                        </div>
                    ))}
                </motion.div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
                        <p>&copy; {currentYear} FixEasy Ireland. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
                            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
                            <Link href="/cookies" className="hover:text-cyan-400 transition-colors">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
