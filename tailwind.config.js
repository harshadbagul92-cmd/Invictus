/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#065A82',
          teal: '#1C7293',
          navy: '#21295C',
          lightBlue: '#E6F0F5',
          lightTeal: '#E0F2FE',
          darkBg: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(28, 114, 147, 0.3)',
        'glow-blue': '0 0 30px -5px rgba(6, 90, 130, 0.4)',
        'card': '0 10px 30px -5px rgba(33, 41, 92, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'invictus-hero': 'linear-gradient(135deg, #21295C 0%, #065A82 50%, #1C7293 100%)',
        'invictus-card': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      }
    },
  },
  plugins: [],
}
