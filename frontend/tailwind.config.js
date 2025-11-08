export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          500: '#6366F1',
          600: '#4F46E5'
        }
      },
      boxShadow: {
        subtle: '0 4px 14px rgba(0,0,0,0.05)',
        lift: '0 10px 28px rgba(0,0,0,0.08)'
      },
      keyframes: {
        sheen: { '0%': { transform: 'translateX(-160%)'}, '100%': { transform: 'translateX(160%)'} },
        blink: { '0%, 80%, 100%': { opacity: .25 }, '40%': { opacity: 1 } },
        floaty: { '0%': { transform: 'translateY(0px)'}, '50%': { transform: 'translateY(-4px)'}, '100%': { transform: 'translateY(0px)'} }
      },
      animation: {
        sheen: 'sheen 1.2s linear',
        blink: 'blink 1.4s infinite both',
        floaty: 'floaty 6s ease-in-out infinite'
      }
    }
  },
  plugins: [],
}
