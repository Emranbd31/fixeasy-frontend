import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>FixEasy - Trusted Professionals. Verified for Your Peace of Mind.</title>
        <meta name="description" content="Hire experienced and vetted pros for all your home needs." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">FixEasy</div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition">Services</a>
              <a href="#how" className="text-gray-700 hover:text-blue-600 transition">How It Works</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-md">
                Book now
              </button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-br from-blue-50/60 to-slate-50/40 rounded-[32px] md:rounded-[48px] shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center p-8 md:p-16">
                {/* Top-right pill inside hero */}
                <a href="#services" className="hidden md:inline-flex absolute top-6 right-6 px-5 py-2 bg-white text-blue-700 border border-blue-200 rounded-full font-semibold shadow hover:bg-blue-50 transition">
                  Book new
                </a>
                {/* Left Content */}
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Trusted Professionals.<br />
                    Verified for Your<br />
                    Peace of Mind.
                  </h1>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Hire experienced and vetted pros<br />
                    for all your home needs.
                  </p>
                  <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Book a Service
                  </button>
                </div>

                {/* Right Image */}
                <div className="flex justify-center items-end">
                  <img 
                    src="/images/worker-illustration.png.png" 
                    alt="Professional team - plumber, cleaner, handyman" 
                    className="w-full max-w-md lg:max-w-lg object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Home Services Section */}
        <section id="services" className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center md:text-left">
              All Home Services,<br />
              One Tap Away
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {/* Service Cards */}
              {[
                { name: "Cleaning", icon: "🧹", color: "bg-blue-100" },
                { name: "Handyman", icon: "🛠️", color: "bg-sky-100" },
                { name: "Plumbing", icon: "🔧", color: "bg-green-100" },
                { name: "Painting", icon: "🎨", color: "bg-indigo-100" },
                { name: "Gardening", icon: "🌿", color: "bg-emerald-100" },
                { name: "Carpentry", icon: "🪚", color: "bg-amber-100" },
                { name: "Appliance Repair", icon: "🔌", color: "bg-blue-100" },
                { name: "Window & Lock Repair", icon: "🪟", color: "bg-cyan-100" },
                { name: "Door & Lock Repair", icon: "🚪", color: "bg-blue-100" },
                { name: "Tiling & Flooring", icon: "🧱", color: "bg-orange-100" },
                { name: "Furniture Assembly", icon: "🧰", color: "bg-cyan-100" },
                { name: "CCTV & Flooring", icon: "📹", color: "bg-blue-100" },
                { name: "HVAC Cooling", icon: "❄️", color: "bg-teal-100" },
              ].map((service, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition cursor-pointer group"
                >
                  <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition`}>
                    {service.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                    {service.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Choose Your Service Section */}
        <section className="py-16 bg-gradient-to-b from-white to-blue-50/20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Choose Your Service
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "🔄", title: "Choose Your Service", color: "bg-blue-100" },
                { icon: "⚡", title: "Match Instantly", color: "bg-blue-100" },
                { icon: "✅", title: "Relax & Be Done", color: "bg-blue-100" },
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose FixEasy Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Why Choose FixEasy
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                { icon: "🛡️", title: "Verified Professionals", description: "All pros are background-checked" },
                { icon: "💳", title: "Secure Payments", description: "Safe and encrypted transactions" },
                { icon: "⚡", title: "Match Instantly", description: "Get matched with pros in seconds" },
                { icon: "💬", title: "Fast Support", description: "24/7 customer support available" },
                { icon: "✅", title: "Relax & Be Done", description: "We handle everything end-to-end" },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-gray-900 text-white text-center">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-6">
              <div className="text-2xl font-bold mb-2">FixEasy</div>
              <p className="text-gray-400 text-sm">Trusted professionals verified for your peace of mind.</p>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} FixEasy Ireland. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
