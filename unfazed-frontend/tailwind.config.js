/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hc: {
          bg: '#f4f7fc',
          lightBlue: '#6bb0ff',
          lightBlueHover: '#59a3fa',
          darkBlue: '#1349b8',
          darkBlueHover: '#0e3a94',
          accentPill: '#2563eb',
          softGray: '#f8fafc',
          cardBorder: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
