/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif', ], // Set Poppins as the default sans font
      },
      colors: {
        customBlue1: '#2A7FC2', // Add your custom color
        customBlue2: '#06428D',
        navtextblack: '#1F2937'
      },
    },
  },
  plugins: [],
}