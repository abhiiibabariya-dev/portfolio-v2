/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        gold: { DEFAULT: '#c8a96b', dim: '#8a7040' },
        'cyber-green': '#4ade80',
        'bg-2': '#0f0f10',
        'bg-3': '#141416',
        'border-2': '#2a2a30',
      },
      keyframes: {
        reveal: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(200,169,107,0)' },
          '50%': { boxShadow: '0 0 14px 3px rgba(200,169,107,0.18)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        reveal: 'reveal 0.65s cubic-bezier(0.16,1,0.3,1) both',
        ticker: 'ticker 28s linear infinite',
        blink: 'blink 1.1s step-end infinite',
        pulseGold: 'pulseGold 3s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease both',
      },
    },
  },
  plugins: [],
};
