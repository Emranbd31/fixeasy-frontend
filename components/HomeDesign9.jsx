import React from "react";

export default function HomeDesign9() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col">
      <header className="flex justify-between items-center px-8 py-6">
        <div className="text-3xl font-extrabold text-gray-900">FixEasy</div>
        <nav className="space-x-8 text-gray-800 font-medium">
          <a href="#" className="hover:text-gray-600 transition">Services</a>
          <a href="#" className="hover:text-gray-600 transition">How It Works</a>
          <a href="#" className="hover:text-gray-600 transition">Contact</a>
          <button className="ml-6 px-5 py-2 bg-gray-900 text-white rounded-full font-semibold shadow hover:bg-gray-800 transition-transform transform hover:translate-x-1 duration-300">Sign Up</button>
        </nav>
      </header>
      <main className="flex flex-col md:flex-row items-center justify-between flex-1 px-8 md:px-20 py-10 gap-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">Professional. Reliable.<br/>Always On Time.</h1>
          <p className="text-lg text-gray-800 mb-8">FixEasy is your go-to for trusted, punctual, and professional home services.</p>
          <div className="flex gap-4 mb-10">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold shadow hover:bg-gray-800 transition-transform transform hover:-translate-x-1 duration-300">Find a Professional</button>
            <button className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold shadow hover:bg-gray-50 transition-transform transform hover:translate-x-1 duration-300">Learn More</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">1,200+</div>
              <div className="text-gray-800 text-sm">vetted professionals</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">150+</div>
              <div className="text-gray-800 text-sm">cities covered</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">45+</div>
              <div className="text-gray-800 text-sm">services available</div>
            </div>
          </div>
        </div>
        <div className="relative w-full max-w-md flex-shrink-0">
          <img src="/hero-images/hero9.svg" alt="Professional Service" className="rounded-3xl shadow-xl w-full animate-slideX" style={{animationDuration:'1.8s'}} />
        </div>
      </main>
    </div>
  );
}
