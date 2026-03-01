/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        pastel: {
          pink: { 50: '#FFF0F5', 100: '#FFE0EB', 200: '#FFB8D4', 300: '#FF8CB8', 400: '#F472B6', 500: '#EC4899' },
          blue: { 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6' },
          green: { 50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399', 500: '#10B981' },
          orange: { 50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74', 400: '#FB923C', 500: '#F97316' },
          yellow: { 50: '#FEFCE8', 100: '#FEF9C3', 200: '#FEF08A', 300: '#FDE047', 400: '#FACC15', 500: '#EAB308' },
          purple: { 50: '#FAF5FF', 100: '#F3E8FF', 200: '#E9D5FF', 300: '#D8B4FE', 400: '#C084FC', 500: '#A855F7' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
