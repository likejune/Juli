import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1815',
        'ink-soft': '#5c574f',
        paper: '#faf8f4',
        'paper-warm': '#f3efe8',
        line: '#e6e1d7',
        gold: '#b08d57',
        'gold-deep': '#8f6f3f',
        // admin dark theme
        night: '#0e1116',
        'night-soft': '#161b22',
        'night-line': '#262d38',
        'night-card': '#1a2029',
        mist: '#9aa4b2',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      animation: {
        'fade-up': 'fadeUp .8s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fadeIn .6s ease both',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
    },
  },
  plugins: [],
};
export default config;
