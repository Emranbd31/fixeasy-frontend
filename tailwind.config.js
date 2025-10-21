/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'fx-primary': 'var(--fx-primary)',
        'fx-primary-ink': 'var(--fx-primary-ink)',
        'fx-emerald': 'var(--fx-emerald)',
        'fx-amber': 'var(--fx-amber)',
        'fx-slate-1': 'var(--fx-slate-1)',
        'fx-slate-2': 'var(--fx-slate-2)',
        'fx-slate-3': 'var(--fx-slate-3)',
        'fx-card': 'var(--fx-card)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '14px',
        xl: '22px',
        full: '9999px',
      },
      boxShadow: {
        '3d': '0 8px 24px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.08)',
      },
      backgroundImage: {
        'fx-grid': 'radial-gradient(circle at center, rgba(255,255,255,.12) 0, rgba(255,255,255,0) 60%)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'shine-sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(150%)' },
        },
      },
      animation: {
        'shine-sweep': 'shine-sweep 0.8s ease-in-out',
      },
    },
  },
  plugins: [],
};
