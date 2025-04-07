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
          secondary: '#854b99',
          tertiary: '#dac9df',
          baseBg: '#c07d6b',
        },
      },
    },
    plugins: [
      require('tailwindcss-animate'),
    ],
  }
  