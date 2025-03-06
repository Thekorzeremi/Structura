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
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'scale-in': 'scale-in 0.15s ease-in-out',
        'fadeIn': 'fade-in 0.2s ease-out',
        'slideIn': 'slide-in 0.2s ease-out'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
