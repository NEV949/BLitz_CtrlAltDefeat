/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(99,102,241,0.20)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 25%), radial-gradient(circle at top right, rgba(129,140,248,0.18), transparent 25%), linear-gradient(135deg, #020617, #0f172a 55%, #111827)'
      }
    }
  },
  plugins: []
};
