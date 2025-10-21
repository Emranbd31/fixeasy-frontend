import React from "react";

export default function HomeDesign7() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex flex-col">
      <header className="flex justify-between items-center px-8 py-6">
        <div className="text-3xl font-extrabold text-pink-900">FixEasy</div>
        <nav className="space-x-8 text-pink-800 font-medium">
          <a href="#" className="hover:text-pink-600 transition">Services</a>
          <a href="#" className="hover:text-pink-600 transition">How It Works</a>
          <a href="#" className="hover:text-pink-600 transition">Contact</a>
          <button className="ml-6 px-5 py-2 bg-pink-600 text-white rounded-full font-semibold shadow hover:bg-pink-700 transition-transform transform hover:translate-x-1 duration-300">Sign Up</button>
        </nav>
      </header>
      <main className="flex flex-col md:flex-row items-center justify-between flex-1 px-8 md:px-20 py-10 gap-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-pink-900 mb-6 leading-tight">Elegant Solutions.<br/>For Every Home.</h1>
          <p className="text-lg text-pink-800 mb-8">FixEasy delivers premium, stylish, and reliable home services at your fingertips.</p>
          <div className="flex gap-4 mb-10">
            <button className="px-6 py-3 bg-pink-600 text-white rounded-full font-semibold shadow hover:bg-pink-700 transition-transform transform hover:-translate-x-1 duration-300">Find a Professional</button>
            <button className="px-6 py-3 bg-white text-pink-700 border border-pink-200 rounded-full font-semibold shadow hover:bg-pink-50 transition-transform transform hover:translate-x-1 duration-300">Learn More</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-pink-700">1,200+</div>
              <div className="text-pink-800 text-sm">vetted professionals</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-pink-700">150+</div>
              <div className="text-pink-800 text-sm">cities covered</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-pink-700">45+</div>
              <div className="text-pink-800 text-sm">services available</div>
            </div>
          </div>
        </div>
        <div className="relative w-full max-w-md flex-shrink-0">
          <img src="/hero-images/hero7.svg" alt="Elegant Home Service" className="rounded-3xl shadow-xl w-full animate-slideX" style={{animationDuration:'1.8s'}} />
        </div>
      </main>
    </div>
  );
}
