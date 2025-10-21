"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  const services = [
    { name: "Cleaning", gradient: "from-blue-400 via-blue-500 to-cyan-500" },
    { name: "Handyman", gradient: "from-yellow-400 via-orange-400 to-orange-500" },
    { name: "Plumbing", gradient: "from-emerald-400 via-teal-400 to-cyan-500" },
    { name: "Painting", gradient: "from-blue-300 via-blue-400 to-blue-500" },
    { name: "Gardening", gradient: "from-green-400 via-emerald-400 to-teal-400" },
    { name: "Carpentry", gradient: "from-cyan-400 via-blue-400 to-blue-500" },
    { name: "Appliance Repair", gradient: "from-blue-400 via-indigo-400 to-purple-400" },
    { name: "Window & Lock Repair", gradient: "from-cyan-300 via-cyan-400 to-blue-400" },
    { name: "Door & Lock Repair", gradient: "from-blue-400 via-cyan-400 to-teal-400" },
    { name: "Door & Lock Repair", gradient: "from-blue-300 via-blue-400 to-cyan-400" },
    { name: "Door's lock Repair", gradient: "from-cyan-400 via-blue-400 to-blue-500" },
    { name: "Titing & Flooring", gradient: "from-blue-400 via-cyan-400 to-sky-400" },
    { name: "Furniture Assembly", gradient: "from-orange-300 via-amber-400 to-yellow-400" },
    { name: "CCTV & Flooring", gradient: "from-blue-400 via-blue-500 to-indigo-500" },
    { name: "HVAC Cooing", gradient: "from-cyan-300 via-sky-400 to-blue-400" },
  ];

  const chooseSteps = [
    { title: "Choose Your Service", color: "from-blue-400 to-cyan-500", number: "1" },
    { title: "Match Instantly", color: "from-cyan-400 to-blue-500", number: "2" },
    { title: "Relax & Done", color: "from-blue-500 to-cyan-600", number: "3" },
  ];

  const features = [
    { title: "Verified Professionals", icon: "✓" },
    { title: "Secure Payments", icon: "🔒" },
    { title: "Match Instantly", icon: "⚡" },
    { title: "Fast Support", icon: "💬" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <header className="flex justify-between items-center px-8 py-6">
        <div className="text-3xl font-bold text-gray-900">FixEasy</div>
        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl">
          Book now
        </button>
      </header>

      <section className="max-w-7xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[40px] shadow-2xl p-12 flex flex-col lg:flex-row items-center gap-12"
        >
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Trusted Professionals.
              <br />
              Verified for Your
              <br />
              Peace of Mind.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Hire experienced and vetted pros
              <br />
              for all your home needs.
            </p>
            <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105">
              Book a Service
            </button>
          </div>

          <div className="flex-1 relative">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              src="/images/worker-illustration.png"
              alt="Professional Workers"
              className="w-full max-w-md mx-auto drop-shadow-2xl"
            />
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            All Home Services,
            <br />
            One Tap Away
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg relative`}>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
                  <div className="relative text-white text-3xl font-bold">
                    {service.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight">
                  {service.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Choose Your Service</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {chooseSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all text-center cursor-pointer"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg text-white font-bold`}
                >
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Why Choose FixEasy</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
