import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0c0a14',
          50: '#1e1932',
          100: '#2d2647',
        },
        gold: {
          DEFAULT: '#c9a227',
          100: '#e5c76b',
          200: '#f0d78a',
        },
        accent: {
          DEFAULT: '#c9a227',
          light: '#e5c76b',
          muted: 'rgba(201, 162, 39, 0.3)',
        },
      },
      backgroundColor: {
        page: 'var(--bg)',
        card: 'var(--bg-card)',
      },
      textColor: {
        DEFAULT: 'var(--text)',
        muted: 'var(--text-muted)',
        accent: 'var(--accent)',
      },
      borderColor: {
        DEFAULT: 'var(--border)',
      },
      boxShadow: {
        glow: '0 0 24px rgba(201, 162, 39, 0.2)',
        'glow-lg': '0 0 40px rgba(201, 162, 39, 0.25)',
      },
      backgroundImage: {
        'gradient-mystical': 'linear-gradient(135deg, #0c0a14 0%, #1e1932 30%, #2d2647 60%, #0c0a14 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
