/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './contexts/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        lg: '3rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          DEFAULT: '#0056D6',
          dark: '#003B9C',
          light: '#00B2E3',
        },
        accent: {
          cyan: '#00B2E3',
          amber: '#FFB800',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#111827',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0056D6 0%, #00B2E3 100%)',
      },
      boxShadow: {
        'brand-card': '0 25px 50px -12px rgba(0, 86, 214, 0.25)',
        'brand-soft': '0 18px 40px -18px rgba(0, 86, 214, 0.18)',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
