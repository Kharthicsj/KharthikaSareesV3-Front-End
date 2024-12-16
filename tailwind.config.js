/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily : {
        poppins : ["Poppins"]
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}

