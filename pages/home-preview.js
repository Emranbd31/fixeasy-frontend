import React, { useState } from "react";
import dynamic from "next/dynamic";

const designs = [
  { name: "Sky Blue Clean", component: dynamic(() => import("../components/HomeDesign1")), hero: "/hero-images/hero1.svg" },
  { name: "Minimalist Slate", component: dynamic(() => import("../components/HomeDesign2")), hero: "/hero-images/hero2.svg" },
  { name: "Irish Flag Premium", component: dynamic(() => import("../components/HomeDesign3")), hero: "/hero-images/hero3.svg" },
  { name: "Warm Orange", component: dynamic(() => import("../components/HomeDesign4")), hero: "/hero-images/hero4.svg" },
  { name: "Premium Yellow", component: dynamic(() => import("../components/HomeDesign5")), hero: "/hero-images/hero5.svg" },
  { name: "Modern Teal", component: dynamic(() => import("../components/HomeDesign6")), hero: "/hero-images/hero6.svg" },
  { name: "Elegant Pink", component: dynamic(() => import("../components/HomeDesign7")), hero: "/hero-images/hero7.svg" },
  { name: "Smart Purple", component: dynamic(() => import("../components/HomeDesign8")), hero: "/hero-images/hero8.svg" },
  { name: "Professional Gray", component: dynamic(() => import("../components/HomeDesign9")), hero: "/hero-images/hero9.svg" },
  { name: "Next Level Indigo", component: dynamic(() => import("../components/HomeDesign10")), hero: "/hero-images/hero10.svg" }
];

export default function HomePreview() {
  const [selected, setSelected] = useState(0);
  const DesignComponent = designs[selected].component;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="text-2xl font-extrabold text-blue-900">FixEasy Home Preview</div>
        <nav className="flex gap-2">
          {designs.map((d, i) => (
            <button
              key={d.name}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition border ${selected === i ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"}`}
              onClick={() => setSelected(i)}
            >
              {d.name}
            </button>
          ))}
        </nav>
      </header>
      <main className="flex-1">
        <DesignComponent />
      </main>
    </div>
  );
}
