'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const services = [
  { id: 1, name: 'Cleaning', description: 'Professional home & office cleaning', gradient: 'from-blue-400 to-cyan-400' },
  { id: 2, name: 'Handyman', description: 'Expert repair & maintenance', gradient: 'from-orange-400 to-red-400' },
  { id: 3, name: 'Plumbing', description: 'Licensed plumbing services', gradient: 'from-blue-500 to-indigo-500' },
  { id: 4, name: 'Electrical', description: 'Certified electrical work', gradient: 'from-yellow-400 to-orange-500' },
  { id: 5, name: 'Painting', description: 'Interior & exterior painting', gradient: 'from-purple-400 to-pink-500' },
  { id: 6, name: 'Gardening', description: 'Lawn care & landscaping', gradient: 'from-green-400 to-emerald-500' },
  { id: 7, name: 'Moving', description: 'Reliable moving services', gradient: 'from-indigo-400 to-blue-500' },
  { id: 8, name: 'Carpentry', description: 'Custom woodwork & furniture', gradient: 'from-amber-600 to-orange-600' },
  { id: 9, name: 'Appliance Repair', description: 'Fix all home appliances', gradient: 'from-gray-500 to-slate-600' },
  { id: 10, name: 'HVAC', description: 'Heating & cooling services', gradient: 'from-cyan-500 to-blue-600' },
  { id: 11, name: 'Pest Control', description: 'Safe pest elimination', gradient: 'from-red-500 to-orange-600' },
  { id: 12, name: 'Locksmith', description: 'Security & lock services', gradient: 'from-slate-600 to-gray-700' }
];

const serviceIcons: Record<string, string> = {
  'Cleaning': '🧹', 'Handyman': '🔨', 'Plumbing': '🔧', 'Electrical': '⚡',
  'Painting': '🎨', 'Gardening': '🌿', 'Moving': '📦', 'Carpentry': '🪚',
  'Appliance Repair': '🔌', 'HVAC': '❄️', 'Pest Control': '🐛', 'Locksmith': '🔐'
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}>
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                Home Services,<br /><span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Made Easy</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed font-light">
                Connect with trusted professionals for all your home service needs. Fast, reliable, and affordable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300">
                    Book a Service
                  </motion.button>
                </Link>
                <Link href="/pro/register">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300">
                    Become a Pro
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }} className="relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-[3rem] blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[3rem] p-8 shadow-2xl">
                  <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center text-9xl">👷‍♂️</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">Professional home services at your fingertips</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ scale: 1.03, y: -8, transition: { type: 'spring', stiffness: 400, damping: 17 } }} whileTap={{ scale: 0.98 }} className="group cursor-pointer">
                <Link href="/book">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br bg-gray-100">
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-90`}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="text-6xl filter drop-shadow-lg">
                          {serviceIcons[service.name]}
                        </motion.div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors tracking-tight">{service.name}</h3>
                      <p className="text-sm text-gray-600 leading-snug font-light">{service.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">Three simple steps to get your home service done</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: '', title: 'Choose Your Service', desc: 'Select from our wide range of professional home services' },
              { icon: '', title: 'Book Appointment', desc: 'Pick a convenient time that works for your schedule' },
              { icon: '', title: 'Get It Done', desc: 'Our verified professionals will complete the job perfectly' }
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -12, transition: { type: 'spring', stiffness: 400, damping: 17 } }} className="relative">
                <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-8 mx-auto shadow-lg shadow-blue-500/30">
                    <span className="text-4xl">{step.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center tracking-tight">{step.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed font-light">{step.desc}</p>
                </div>
                {i < 2 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">Why Choose FixEasy</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">We're committed to providing the best service experience</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '', title: 'Verified Professionals', desc: 'All service providers are background checked' },
              { icon: '', title: 'Quality Guaranteed', desc: 'We stand behind every service' },
              { icon: '', title: 'Transparent Pricing', desc: 'No hidden fees - clear upfront costs' },
              { icon: '', title: 'Easy Booking', desc: 'Book online in minutes' }
            ].map((feat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/20">
                  <span className="text-3xl text-white">{feat.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{feat.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed font-light">Join thousands of satisfied customers who trust FixEasy for their home service needs</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="px-12 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300">Book Now</motion.button>
              </Link>
              <Link href="/pro/register">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="px-12 py-5 bg-transparent text-white rounded-2xl font-bold text-lg border-2 border-white hover:bg-white/10 transition-all duration-300">Join as Professional</motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
