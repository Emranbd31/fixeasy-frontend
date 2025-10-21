"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  const services = [
    { name: "Cleaning", icon: "🧹", gradient: "from-blue-400 to-blue-600" },
    { name: "Handyman", icon: "🔧", gradient: "from-cyan-400 to-cyan-600" },
    { name: "Plumbing", icon: "🚰", gradient: "from-teal-400 to-teal-600" },
    { name: "Painting", icon: "🖌️", gradient: "from-blue-400 to-blue-600" },
    { name: "Gardening", icon: "🌱", gradient: "from-emerald-400 to-emerald-600" },
    { name: "Carpentry", icon: "🔨", gradient: "from-cyan-400 to-cyan-600" },
    { name: "Appliance Repair", icon: "⚙️", gradient: "from-blue-400 to-blue-600" },
    { name: "Window & Lock Repair", icon: "🪟", gradient: "from-sky-400 to-sky-600" },
    { name: "Door & Lock Repair", icon: "🚪", gradient: "from-cyan-400 to-cyan-600" },
    { name: "Door & Lock Repair", icon: "🔑", gradient: "from-blue-400 to-blue-600" },
    { name: "Door Lock Repair", icon: "🔐", gradient: "from-cyan-400 to-cyan-600" },
    { name: "Tiling & Flooring", icon: "🔲", gradient: "from-blue-400 to-blue-600" },
    { name: "Furniture Assembly", icon: "🪑", gradient: "from-sky-400 to-sky-600" },
    { name: "CCTV & Flooring", icon: "📹", gradient: "from-cyan-400 to-cyan-600" },
    { name: "HVAC Cooling", icon: "❄️", gradient: "from-teal-400 to-teal-600" },
  ];

  const chooseSteps = [
    { title: "Choose Your service", icon: "🔄", color: "bg-blue-500" },
    { title: "Match Instantly", icon: "💬", color: "bg-cyan-500" },
    { title: "Relax & Done", icon: "✅", color: "bg-blue-500" },
  ];

  const features = [
    { title: "Verified Professionals", icon: "✓" },
    { title: "Secure Payments", icon: "✓" },
    { title: "Match Instantly", icon: "●" },
    { title: "Fast Support", icon: "+" },
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
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  {service.icon}
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
                  className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg`}
                >
                  {step.icon}
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
