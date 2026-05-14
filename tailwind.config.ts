import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './emails/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'notte-profonda': '#18122B',
        'viola-caldo': '#2A1E4A',
        'magenta-cosmico': '#5D2C5A',
        'oro-caldo': '#D7A86E',
        'rosa-polvere': '#F1D8C9',
        'panna-stellare': '#FFF6E8'
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        body: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
