import React from "react";

export default function HomeDesign6() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex flex-col">
      <header className="flex justify-between items-center px-8 py-6">
        <div className="text-3xl font-extrabold text-teal-900">FixEasy</div>
        <nav className="space-x-8 text-teal-800 font-medium">
          <a href="#" className="hover:text-teal-600 transition">Services</a>
          <a href="#" className="hover:text-teal-600 transition">How It Works</a>
          <a href="#" className="hover:text-teal-600 transition">Contact</a>
          <button className="ml-6 px-5 py-2 bg-teal-600 text-white rounded-full font-semibold shadow hover:bg-teal-700 transition-transform transform hover:translate-x-1 duration-300">Sign Up</button>
        </nav>
      </header>
      <main className="flex flex-col md:flex-row items-center justify-between flex-1 px-8 md:px-20 py-10 gap-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-6 leading-tight">Modern Home Services.<br/>Book in Seconds.</h1>
          <p className="text-lg text-teal-800 mb-8">Experience seamless booking and premium support for all your home needs.</p>
          <div className="flex gap-4 mb-10">
            <button className="px-6 py-3 bg-teal-600 text-white rounded-full font-semibold shadow hover:bg-teal-700 transition-transform transform hover:-translate-x-1 duration-300">Find a Professional</button>
            <button className="px-6 py-3 bg-white text-teal-700 border border-teal-200 rounded-full font-semibold shadow hover:bg-teal-50 transition-transform transform hover:translate-x-1 duration-300">Learn More</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-teal-700">1,200+</div>
              <div className="text-teal-800 text-sm">vetted professionals</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-teal-700">150+</div>
              <div className="text-teal-800 text-sm">cities covered</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-2xl font-bold text-teal-700">45+</div>
              <div className="text-teal-800 text-sm">services available</div>
            </div>
          </div>
        </div>
        <div className="relative w-full max-w-md flex-shrink-0">
          <img src="/hero-images/hero6.svg" alt="Modern Home Service" className="rounded-3xl shadow-xl w-full animate-slideX" style={{animationDuration:'1.8s'}} />
        </div>
      </main>
    </div>
  );
}
