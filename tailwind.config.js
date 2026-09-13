/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./HTML/**/*.html",
    "./JavaScript/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        neon: { DEFAULT: '#B87333', cyan: '#D6A15D', blue: '#B87333' },
        ink: { 900: '#050505', 800: '#17110D' }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
