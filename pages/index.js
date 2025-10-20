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
        <main className="flex flex-col items-start justify-center px-8 md:px-20 py-24 gap-8 flex-1 min-h-[85vh] md:min-h-[90vh] max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">Trusted Professionals.<br/>Verified for Your Peace of Mind.</h1>
            <p className="text-xl text-gray-700 mb-10">Easily book reliable home services in your area. All professionals are vetted to ensure your safety.</p>
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
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/gardening.svg" alt="Gardening" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Gardening</h3>
                  <p className="text-sm text-gray-600">car vered</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/appliances.svg" alt="Appliances" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Appliances</h3>
                  <p className="text-sm text-gray-600">Available 24/7</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/dedwork.svg" alt="Deadwork" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Deskwork</h3>
                  <p className="text-sm text-gray-600">assistance</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/moving.svg" alt="Moving" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Moving</h3>
                  <p className="text-sm text-gray-600">Moving & cleaning</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/smart-home.svg" alt="Smart Home" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Smart Home</h3>
                  <p className="text-sm text-gray-600">service</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/painting.svg" alt="Painting" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Painting</h3>
                  <p className="text-sm text-gray-600">Heating</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/heating.svg" alt="Heating" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Heating &</h3>
                  <p className="text-sm text-gray-600">cooling</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <img src="/icons/security.svg" alt="Security" className="w-12 h-12" />
                <div>
                  <h3 className="font-bold text-gray-900">Security</h3>
                  <p className="text-sm text-gray-600">Remain private</p>
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
                  <p className="text-gray-600 text-sm">Industry leading coverage for all services</p>
                </li>
                <li>
                    <h3 className="font-bold text-gray-900 mb-1">Dedicated assistance</h3>
                  <p className="text-gray-600 text-sm">Our Team is available 24/7 to help with any issues</p>
                </li>
                <li>
                  <h3 className="font-bold text-gray-900">Satisfaction guaranteed</h3>
                </li>
              </ul>
              <ul className="space-y-6">
                <li>
                    <h3 className="font-bold text-gray-900 mb-1">Security for compliance</h3>
                    <p className="text-gray-600 text-sm">We maintain required levels of industry leading security adherence to regulations</p>
                </li>
                <li>
                  <h3 className="font-bold text-gray-900 mb-1">Anonymous ratings</h3>
                    <p className="text-gray-600 text-sm">Leave feedback with confidence - your identity remains private</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 mb-8">Have questions or need help? Our support team is here for you 24/7.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-3xl mb-2">📞</div>
                <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+353 1 234 5678</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-3xl mb-2">✉️</div>
                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">support@fixeasy.irish</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-3xl mb-2">📍</div>
                <h3 className="font-bold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">Dublin, Ireland</p>
              </div>
            </div>
            <button className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition">Contact Us</button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4">FixEasy</h3>
                <p className="text-gray-400 text-sm">Trusted professionals verified for your peace of mind.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Services</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Plumbing</a></li>
                  <li><a href="#" className="hover:text-white transition">Electrical</a></li>
                  <li><a href="#" className="hover:text-white transition">Cleaning</a></li>
                  <li><a href="#" className="hover:text-white transition">Gardening</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition">Press</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 text-sm text-gray-400">
              © {new Date().getFullYear()} FixEasy Ireland. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
