/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'nav-gradient': 'linear-gradient(to right, #1a2955, #2c4875, #3a8ea0)',
      },
    },
  },
  plugins: [],
}