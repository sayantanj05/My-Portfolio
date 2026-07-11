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
        neon: { DEFAULT: '#00BFFF', cyan: '#39F6FF', blue: '#1b5cff' },
        ink: { 900: '#050505', 800: '#070A12' }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
