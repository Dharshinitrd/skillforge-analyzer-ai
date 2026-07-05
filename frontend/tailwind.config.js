/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#070913',
        cardBg: 'rgba(15, 23, 42, 0.45)',
        brandPurple: {
          light: '#a78bfa',
          DEFAULT: '#7c3aed',
          dark: '#5b21b6',
        },
        brandBlue: {
          light: '#60a5fa',
          DEFAULT: '#2563eb',
          dark: '#1e3a8a',
        },
        brandCyan: {
          light: '#67e8f9',
          DEFAULT: '#0891b2',
          dark: '#155e75',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'neon-purple': '0 0 15px rgba(124, 58, 237, 0.4)',
        'neon-cyan': '0 0 15px rgba(8, 145, 178, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
