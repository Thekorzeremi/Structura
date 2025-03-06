/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      keyframes: {
        'scale-in': {
          '0%': { transform: 'translate(-50%, 0) scale(0.95)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0) scale(1)', opacity: '1' }
        }
      },
      animation: {
        'scale-in': 'scale-in 0.15s ease-in-out'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
