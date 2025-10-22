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
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
              >
                🏠 Ireland's #1 Home Service Platform
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                Home Services,<br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  Made Easy
                </span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Connect with <span className="font-semibold text-gray-900">trusted professionals</span> for all your home service needs. Fast, reliable, and affordable.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link href="/book">
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }} 
                    whileTap={{ scale: 0.95 }} 
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-600/30 hover:shadow-2xl transition-all duration-300"
                  >
                    📅 Book a Service
                  </motion.button>
                </Link>
                <Link href="/pro/register">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="px-10 py-4 bg-white text-gray-900 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl border-2 border-gray-200 hover:border-blue-600 transition-all duration-300"
                  >
                    💼 Become a Pro
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start text-center lg:text-left">
                <div>
                  <div className="text-3xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Pro Workers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Right Image Area */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }} 
              className="relative hidden lg:block"
            >
              <div className="relative w-full max-w-2xl mx-auto">
                {/* Main Card */}
                <div className="relative bg-white rounded-[3rem] p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Service Icons Grid */}
                    {[
                      { icon: '👷‍♂️', label: 'Workers', color: 'from-blue-400 to-blue-600' },
                      { icon: '🔧', label: 'Repairs', color: 'from-orange-400 to-red-500' },
                      { icon: '🧹', label: 'Cleaning', color: 'from-cyan-400 to-blue-500' },
                      { icon: '⚡', label: 'Fast', color: 'from-yellow-400 to-orange-500' }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className={`bg-gradient-to-br ${item.color} rounded-3xl p-8 text-center shadow-lg cursor-pointer`}
                      >
                        <div className="text-6xl mb-3">{item.icon}</div>
                        <div className="text-white font-bold text-lg">{item.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-bold"
                >
                  ✓ Verified Pros
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: '-100px' }} 
            transition={{ duration: 0.6 }} 
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
            >
              🏆 12 Professional Services
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Service</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Professional home services at your fingertips. Book instantly with verified pros.
            </p>
          </motion.div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {services.map((service, index) => (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -12, transition: { type: 'spring', stiffness: 400, damping: 17 } }} 
                whileTap={{ scale: 0.97 }} 
                className="group cursor-pointer"
              >
                <Link href="/book">
                  <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200">
                    {/* Gradient Background */}
                    <div className="relative h-36 md:h-40 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-100`}></div>
                      
                      {/* Decorative Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full -ml-8 -mb-8"></div>
                      </div>
                      
                      {/* Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          whileHover={{ scale: 1.15, rotate: 8 }} 
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }} 
                          className="text-6xl md:text-7xl filter drop-shadow-2xl"
                        >
                          {serviceIcons[service.name]}
                        </motion.div>
                      </div>

                      {/* Popular Badge */}
                      {index < 3 && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ⭐ Popular
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight">
                        {service.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-3">
                        {service.description}
                      </p>
                      
                      {/* Book Button */}
                      <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                        <span>Book Now</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-1"
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }} 
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold"
            >
              ⚡ Quick & Easy Process
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              How It <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Get your home services done in three simple steps
            </p>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
            
            {[
              { 
                icon: '🔍', 
                number: '01',
                title: 'Choose Service', 
                desc: 'Browse our 12 professional services and select what you need',
                color: 'from-blue-500 to-cyan-500'
              },
              { 
                icon: '📅', 
                number: '02',
                title: 'Book & Schedule', 
                desc: 'Pick a convenient time and get instant confirmation from verified pros',
                color: 'from-cyan-500 to-blue-600'
              },
              { 
                icon: '✅', 
                number: '03',
                title: 'Get It Done', 
                desc: 'Sit back while our professionals complete your service perfectly',
                color: 'from-blue-600 to-cyan-600'
              }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ y: -12, transition: { type: 'spring', stiffness: 400, damping: 17 } }} 
                className="relative"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-xl text-white font-bold text-lg`}>
                    {step.number}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl p-8 pt-14 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-200 h-full relative overflow-hidden">
                  {/* Decorative Background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.color} opacity-5 rounded-full -mr-16 -mt-16`}></div>
                  
                  {/* Icon */}
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className="w-24 h-24 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg"
                    >
                      <span className="text-5xl">{step.icon}</span>
                    </motion.div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Arrow for connection (desktop only) */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 z-20">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-3xl text-blue-500"
                      >
                        →
                      </motion.div>
                    </div>
                  )}
                </div>
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
