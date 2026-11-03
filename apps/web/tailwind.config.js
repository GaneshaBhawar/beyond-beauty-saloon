/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          ivory: 'var(--theme-bg)',
          black: 'var(--theme-text-main)',
          rose: 'var(--theme-primary)',
          'rose-dark': 'var(--theme-primary-dark)',
          'rose-light': 'var(--theme-primary-light)',
          gold: 'var(--theme-accent)',
          'gold-light': 'var(--theme-accent-light)',
          gray: 'var(--theme-border)',
          muted: 'var(--theme-text-muted)',
          card: 'var(--theme-card)',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-manrope)',
          'Manrope',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        serif: [
          'var(--font-manrope)',
          'Manrope',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'luxury-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 8px 10px -4px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
