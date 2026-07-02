/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Stitch design system tokens
        primary: {
          50:  '#f0e8ff',
          100: '#e2d0ff',
          200: '#c4a3ff',
          300: '#a474ff',
          400: '#8b4fff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b1578',
          950: '#1e0a4e',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        surface: {
          lowest: '#0e0e13',
          low:    '#1b1b20',
          DEFAULT:'#1f1f25',
          high:   '#2a292f',
          highest:'#35343a',
          bright: '#39383e',
        },
        dark: {
          900: '#131318',
          950: '#0e0e13',
        },
        // Keep backward compat
        success: { 500: '#10b981' },
        danger:  { 500: '#ef4444' },
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'shimmer':   'shimmer 2.5s infinite',
        'pulse-glow':'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 4s linear infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        slideUp:   { '0%': { transform:'translateY(16px)', opacity:'0' }, '100%': { transform:'translateY(0)', opacity:'1' } },
        shimmer:   { '0%': { backgroundPosition:'-200% center' }, '100%': { backgroundPosition:'200% center' } },
        pulseGlow: { '0%,100%': { boxShadow:'0 0 15px rgba(124,58,237,0.25)' }, '50%': { boxShadow:'0 0 35px rgba(124,58,237,0.55)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
