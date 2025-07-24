/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tw-animate-css"),
    // πρόσθεσε εδώ ό,τι άλλο plugin χρειάζεσαι
  ],
} 