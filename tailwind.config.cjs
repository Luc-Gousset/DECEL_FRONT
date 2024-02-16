/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    fontFamily: {
      sans: [
        '"Segoe UI"',
        'Roboto',
        'sans-serif',
      ],
    },
    extend: {},
  },
  plugins: [],
}
