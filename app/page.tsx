'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const services = [
  { id: 1, name: 'Cleaning', description: 'Professional home & office cleaning', gradient: 'from-blue-400 to-cyan-400', price: '€29' },
  { id: 2, name: 'Handyman', description: 'Expert repair & maintenance', gradient: 'from-orange-400 to-red-400', price: '€35' },
  { id: 3, name: 'Plumbing', description: 'Licensed plumbing services', gradient: 'from-blue-500 to-indigo-500', price: '€45' },
  { id: 4, name: 'Electrical', description: 'Certified electrical work', gradient: 'from-yellow-400 to-orange-500', price: '€55' },
  { id: 5, name: 'Painting', description: 'Interior & exterior painting', gradient: 'from-purple-400 to-pink-500', price: '€40' },
  { id: 6, name: 'Gardening', description: 'Lawn care & landscaping', gradient: 'from-green-400 to-emerald-500', price: '€30' },
  { id: 7, name: 'Moving', description: 'Reliable moving services', gradient: 'from-indigo-400 to-blue-500', price: '€60' },
  { id: 8, name: 'Carpentry', description: 'Custom woodwork & furniture', gradient: 'from-amber-600 to-orange-600', price: '€50' },
  { id: 9, name: 'Appliance Repair', description: 'Fix all home appliances', gradient: 'from-gray-500 to-slate-600', price: '€40' },
  { id: 10, name: 'HVAC', description: 'Heating & cooling services', gradient: 'from-cyan-500 to-blue-600', price: '€65' },
  { id: 11, name: 'Pest Control', description: 'Safe pest elimination', gradient: 'from-red-500 to-orange-600', price: '€45' },
  { id: 12, name: 'Locksmith', description: 'Security & lock services', gradient: 'from-slate-600 to-gray-700', price: '€35' }
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

              {/* Stats - MORE SPECIFIC NUMBERS */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start text-center lg:text-left">
                <div>
                  <div className="text-3xl font-bold text-gray-900">5,248+</div>
                  <div className="text-sm text-gray-600">Jobs Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Verified Pros</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">4.8★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <div className="flex items-center gap-2 bg-green-50 border-2 border-green-200 px-4 py-2 rounded-full">
                  <span className="text-lg">✅</span>
                  <span className="text-sm font-semibold text-green-800">ID Verified</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-full">
                  <span className="text-lg">🛡️</span>
                  <span className="text-sm font-semibold text-blue-800">Insured</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 border-2 border-purple-200 px-4 py-2 rounded-full">
                  <span className="text-lg">💳</span>
                  <span className="text-sm font-semibold text-purple-800">Secure Payment</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image Area */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }} 
              className="relative hidden lg:block"
            >
              <div className="relative w-full max-w-2xl mx-auto">
                {/* Professional Image Placeholder with Real Photos Look */}
                <div className="relative bg-gradient-to-br from-blue-100 via-white to-cyan-100 rounded-[3rem] p-8 shadow-2xl overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
                    }}></div>
                  </div>
                  
                  <div className="relative grid grid-cols-2 gap-4">
                    {/* Professional Service Display Cards */}
                    {[
                      { icon: '👨‍🔧', label: 'Verified Pros', count: '500+', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
                      { icon: '⭐', label: 'Top Rated', count: '4.8/5', color: 'from-yellow-400 to-orange-500', bg: 'bg-yellow-50' },
                      { icon: '✅', label: 'Jobs Done', count: '5,248+', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
                      { icon: '⚡', label: 'Fast Service', count: '24/7', color: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-50' }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className={`${item.bg} backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-white/50`}
                      >
                        <div className="text-4xl mb-2">{item.icon}</div>
                        <div className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-1`}>
                          {item.count}
                        </div>
                        <div className="text-gray-700 text-sm font-semibold">{item.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Floating Badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 bg-green-500 text-white px-6 py-3 rounded-full shadow-xl font-bold border-4 border-white"
                >
                  ✓ ID Verified
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  className="absolute -bottom-6 -left-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl font-bold border-4 border-white"
                >
                  🛡️ Insured
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

          {/* Service Cards Grid - Professional Design */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {services.map((service, index) => (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 17 } }} 
                whileTap={{ scale: 0.98 }} 
                className="group cursor-pointer"
              >
                <Link href="/book">
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-400 h-full">
                    {/* Icon Circle - More Professional Look */}
                    <div className="relative p-6 pb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <span className="text-3xl">{serviceIcons[service.name]}</span>
                      </div>
                      
                      {/* Popular Badge */}
                      {index < 3 && (
                        <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                          ⭐ Popular
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {service.description}
                      </p>
                      
                      {/* Pricing - More Prominent */}
                      <div className="mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {service.price}
                          </span>
                          <span className="text-xs text-gray-500">starting</span>
                        </div>
                      </div>
                      
                      {/* Book Button - More Professional */}
                      <div className="flex items-center justify-between text-blue-600 font-semibold text-sm">
                        <span className="group-hover:text-blue-700 transition-colors">View Details</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-blue-600 group-hover:text-blue-700"
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

      {/* AS SEEN IN SECTION */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
              As Featured In
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
              <div className="text-xl md:text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">The Irish Times</div>
              <div className="text-xl md:text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">RTÉ</div>
              <div className="text-xl md:text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">Irish Independent</div>
              <div className="text-xl md:text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">The Herald</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS SECTION */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }} 
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold"
            >
              ⭐ Trusted by Thousands
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              What Our <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Customers Say</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Real reviews from real customers across Ireland
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: 'Sarah Murphy',
                location: 'Dublin',
                service: 'Cleaning',
                rating: 5,
                text: 'Simply amazing! Booked a cleaner within minutes. The service was professional and my house has never looked better. Highly recommend!',
                avatar: '👩🏻'
              },
              {
                name: 'John O\'Brien',
                location: 'Cork',
                service: 'Plumbing',
                rating: 5,
                text: 'Had a plumbing emergency at 9pm. Found a verified pro immediately who fixed everything the next morning. Outstanding service!',
                avatar: '👨🏻'
              },
              {
                name: 'Emma Walsh',
                location: 'Galway',
                service: 'Electrical',
                rating: 5,
                text: 'The electrician was ID-verified, arrived on time, and did excellent work. Transparent pricing with no hidden fees. Will use again!',
                avatar: '👩🏼'
              },
              {
                name: 'Michael Byrne',
                location: 'Limerick',
                service: 'Handyman',
                rating: 5,
                text: 'Needed several repairs done. The handyman was skilled, friendly, and finished ahead of schedule. Great value for money!',
                avatar: '👨🏼'
              },
              {
                name: 'Lisa Keane',
                location: 'Waterford',
                service: 'Gardening',
                rating: 5,
                text: 'My garden was completely transformed! The gardener was knowledgeable and the results exceeded my expectations.',
                avatar: '👩🏻‍🦰'
              },
              {
                name: 'David Kelly',
                location: 'Dublin',
                service: 'Moving',
                rating: 5,
                text: 'Stress-free moving experience! The team was careful with my belongings and made the whole process smooth and easy.',
                avatar: '👨🏻‍🦰'
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-200"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, idx) => (
                    <span key={idx} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base">
                  "{testimonial.text}"
                </p>

                {/* Customer Info - More Professional Design */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location} • {testimonial.service}</div>
                  </div>
                  <div className="text-green-600 font-semibold text-sm">✓ Verified</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trustpilot-style Overall Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200 max-w-2xl mx-auto"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx} className="text-green-500 text-3xl">★</span>
                ))}
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">4.8 out of 5</div>
                <div className="text-gray-600 mt-2">Based on 2,847+ customer reviews</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
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
              className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
            >
              💎 Premium Quality Service
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">FixEasy</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best home service experience in Ireland
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { 
                icon: '✅', 
                title: 'ID-Verified Professionals', 
                desc: 'All pros are background checked, ID-verified, and certified before joining our platform',
                color: 'from-green-400 to-emerald-500'
              },
              { 
                icon: '🏆', 
                title: 'Happiness Pledge', 
                desc: 'Not satisfied? We\'ll work to make it right or your money back - guaranteed',
                color: 'from-yellow-400 to-orange-500'
              },
              { 
                icon: '💰', 
                title: 'Transparent Pricing', 
                desc: 'No hidden fees - see clear upfront costs before you book. Starting from €29',
                color: 'from-blue-400 to-cyan-500'
              },
              { 
                icon: '⚡', 
                title: 'Instant Booking', 
                desc: 'Book your service online in minutes. 24/7 availability with real-time confirmation',
                color: 'from-purple-400 to-pink-500'
              }
            ].map((feat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-200 text-center h-full relative overflow-hidden">
                  {/* Decorative Background */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feat.color} opacity-5 rounded-full -mr-12 -mt-12`}></div>
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="relative"
                  >
                    <div className={`w-20 h-20 bg-gradient-to-br ${feat.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <span className="text-4xl">{feat.icon}</span>
                    </div>
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-center"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span className="text-gray-700 font-semibold">Insured Services</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span className="text-gray-700 font-semibold">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-gray-700 font-semibold">4.8/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇮🇪</span>
              <span className="text-gray-700 font-semibold">Proudly Irish</span>
            </div>
          </motion.div>

          {/* Money-Back Guarantee Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-4 border-green-300 rounded-3xl p-8 text-center shadow-xl">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Our Happiness Pledge</h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                If you're not 100% satisfied with your service, we'll work to make it right or provide a <span className="font-bold text-green-700">full refund</span>. Your satisfaction is our guarantee.
              </p>
            </div>
          </motion.div>
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
