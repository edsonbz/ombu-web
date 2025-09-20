/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#f2f3efff',
          secondary: '#72823D',
          tertiary: '#f2f3efff',
          baseBg: '#c07d6b',
        },
      },
    },
    plugins: [
      require('tailwindcss-animate'),
    ],
  }
  