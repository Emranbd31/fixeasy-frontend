import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>FixEasy - Trusted Professionals. Verified for Your Peace of Mind.</title>
        <meta name="description" content="Easily book reliable home services in your area. All professionals are vetted to ensure your safety." />
      </Head>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-6 bg-white/90 backdrop-blur border-b border-gray-200">
          <div className="text-3xl font-extrabold text-blue-900">FixEasy</div>
          <nav className="flex gap-8 text-gray-700 font-medium items-center">
            <a href="#services" className="hover:text-blue-600 transition">Services</a>
            <a href="#how" className="hover:text-blue-600 transition">How It Works</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
            <button className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300">Sign Up</button>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 gap-10 flex-1">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">Trusted Professionals.<br/>Verified for Your Peace of Mind.</h1>
            <p className="text-lg text-gray-700 mb-8">Easily book reliable home services in your area. All professionals are vetted to ensure your safety.</p>
            <div className="flex gap-4 mb-10">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition-transform transform hover:-translate-x-1 duration-300">Find a Professional</button>
              <button className="px-6 py-3 bg-white text-blue-700 border border-blue-200 rounded-full font-semibold shadow hover:bg-blue-50 transition-transform transform hover:translate-x-1 duration-300">Learn More</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
                <div className="text-3xl font-bold text-blue-600">1,200+</div>
                <div className="text-gray-600 text-sm mt-1">vetted professionals</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
                <div className="text-3xl font-bold text-blue-600">150+</div>
                <div className="text-gray-600 text-sm mt-1">cities covered</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
                <div className="text-3xl font-bold text-blue-600">45+</div>
                <div className="text-gray-600 text-sm mt-1">services available</div>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-md flex-shrink-0">
            <img
              src="/images/worker-illustration.png"
              alt="Professional worker helping a FixEasy customer"
              className="rounded-3xl shadow-2xl w-full animate-slideX"
              style={{ animationDuration: "1.8s" }}
            />
          </div>
        </main>

        {/* Premium Support Section */}
        <section id="services" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Premium support for every booking</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-12">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/insurance.svg" alt="Insurance" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Comprehensive insurance</h3>
                  <p className="text-sm text-gray-600">Coverage on every booking for peace of mind.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/gardening.svg" alt="Gardening" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Gardening</h3>
                  <p className="text-sm text-gray-600">Seasonal landscaping and outdoor care.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/appliances.svg" alt="Appliance support" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Appliance installs</h3>
                  <p className="text-sm text-gray-600">Setups and repairs handled by experts.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/dedwork.svg" alt="Handyman services" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Handyman tasks</h3>
                  <p className="text-sm text-gray-600">Small fixes, furniture builds, and more.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/moving.svg" alt="Moving help" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Moving support</h3>
                  <p className="text-sm text-gray-600">Packing, lifting, and end-of-lease cleaning.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/smart-home.svg" alt="Smart home" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Smart home setup</h3>
                  <p className="text-sm text-gray-600">Secure installs for cameras, alarms, and more.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/painting.svg" alt="Painting" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Painting & décor</h3>
                  <p className="text-sm text-gray-600">Refresh interiors with premium finishes.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/heating.svg" alt="Heating and cooling" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Heating & cooling</h3>
                  <p className="text-sm text-gray-600">Certified HVAC engineers on standby.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/security.svg" alt="Security" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Security checks</h3>
                  <p className="text-sm text-gray-600">Background-vetted pros with ID verification.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safeguards Section */}
        <section id="how" className="py-16 bg-gradient-to-r from-blue-50 to-gray-50">
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Safeguards for Clients, Pros, and Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <ul className="space-y-6">
                <li>
                  <h3 className="font-bold text-gray-900 mb-1">Insurance & compliance</h3>
                  <p className="text-gray-600 text-sm">Industry leading coverage for every service.</p>
                </li>
                <li>
                  <h3 className="font-bold text-gray-900 mb-1">Dedicated assistance</h3>
                  <p className="text-gray-600 text-sm">Our team is available 24/7 to help with any issues.</p>
                </li>
                <li>
                  <h3 className="font-bold text-gray-900">Satisfaction guaranteed</h3>
                </li>
              </ul>
              <ul className="space-y-6">
                <li>
                  <h3 className="font-bold text-gray-900 mb-1">Secure for compliance</h3>
                  <p className="text-gray-600 text-sm">We maintain required levels of industry-leading security and regulation adherence.</p>
                </li>
                <li>
                  <h3 className="font-bold text-gray-900 mb-1">Anonymous ratings</h3>
                  <p className="text-gray-600 text-sm">Leave feedback with confidence—your identity remains private.</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center text-gray-500 text-sm bg-white border-t border-gray-200">
          © {new Date().getFullYear()} FixEasy. All rights reserved.
        </footer>
      </div>
    </>
  );
}
