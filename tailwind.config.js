/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Include all React component files
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#10b981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
          foreground: '#ffffff',
        },
        ring: {
          DEFAULT: '#3b82f6',
        },
        input: {
          DEFAULT: '#9CA3AF',
        },
        accent: {
          DEFAULT: '#F9FAFB',
          foreground: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem', // Added from plan
        '2xl': '1.5rem', // Added from plan
      },
      keyframes: { // Added slideIn animation from index.html style
        slideIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: { // Added slideIn animation utility
        slideIn: 'slideIn 0.5s ease-out forwards',
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
