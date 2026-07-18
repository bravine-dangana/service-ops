import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  corePlugins: {
    // roadmap.sh defines its own narrower `.container` (max-w-830px); see app/globals.css
    container: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        cellulant: {
          dark: '#0A1B2E',
          dark2: '#0E2743',
          blue: '#009EDA',
          navy: '#005BA0',
          mustard: '#FFBE1A',
          purple: '#7030A0',
        },
        tingg: {
          green: '#05E386',
          navy: '#294383',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'slide-in': 'slide-in 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
