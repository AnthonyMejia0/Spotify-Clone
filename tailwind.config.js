/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        song: {
          to: {
            'margin-left': '-200%',
          },
        },
      },
    },
    animation: {
      slide: 'song 10s ease-out infinite',
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
