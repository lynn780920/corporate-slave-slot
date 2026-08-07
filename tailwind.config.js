/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        egypt: {
          dark: '#0a090d',
          card: '#14121a',
          gold: '#f59e0b',
          goldLight: '#fde047',
          goldDark: '#b45309',
          ruby: '#ef4444',
          emerald: '#10b981',
          lapis: '#3b82f6',
          amethyst: '#8b5cf6',
          accent: '#d97706'
        }
      },
      fontFamily: {
        sans: ['Cinzel', 'Outfit', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'gold-shimmer': 'goldShimmer 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 15px rgba(245, 158, 11, 0.4), inset 0 0 15px rgba(245, 158, 11, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(245, 158, 11, 0.8), inset 0 0 25px rgba(245, 158, 11, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        goldShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
