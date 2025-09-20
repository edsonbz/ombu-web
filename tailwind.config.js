/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#a12a0a',
          secondary: '#72823D',
          tertiary: '#a5b080ff',
          baseBg: '#c07d6b',
        },
      },
    },
    plugins: [
      require('tailwindcss-animate'),
    ],
  }
  