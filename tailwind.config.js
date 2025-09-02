/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'matrix-green': '#00ff00',
        'terminal-green': '#00ff41',
        'dark-green': '#00cc00',
      },
      boxShadow: {
        'green-glow': '0 0 20px #00ff0040',
        'green-strong': '0 0 30px #00ff0060',
      }
    },
  },
  plugins: [],
}