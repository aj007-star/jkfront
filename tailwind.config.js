// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-600': '#2874F0',
        'blue-700': '#1B1F8A',
        'blue-300': '#5D9CEC',
        'blue-200': '#A0C9F0',
      },
    },
  },
  plugins: [],
}
