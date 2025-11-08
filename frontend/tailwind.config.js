export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: { 500: '#8b5cf6' },
        pop: { 500: '#ec4899' }
      },
      boxShadow: {
        subtle: '0 4px 14px rgba(0,0,0,0.05)',
        lift: '0 10px 28px rgba(0,0,0,0.08)'
      },
      keyframes: {
        blink: { '0%, 50%': { opacity: 1 }, '50.01%, 100%': { opacity: 0 } },
        overlayIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } }
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        overlayIn: 'overlayIn .2s ease-out'
      },
      backgroundImage: {
        'agent-grad': 'linear-gradient(120deg, rgba(139,92,246,0.12), rgba(236,72,153,0.10))'
      }
    }
  },
  plugins: [],
}
