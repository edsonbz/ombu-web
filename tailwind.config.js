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
          secondary: '#3e0d15',
          tertiary: '#F8F9F8',
          baseBg: '#c07d6b',
        },
      },
    },
    plugins: [
      require('tailwindcss-animate'),
    ],
  }
  