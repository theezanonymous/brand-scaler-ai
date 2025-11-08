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
        subtle: '0 8px 24px rgba(0,0,0,0.06)'
      }
    }
  },
  plugins: [],
}
