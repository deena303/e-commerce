import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D9A23A',
        graphite: '#1E1F24',
        cobalt: '#2448FF',
        offwhite: '#F8F7F4',
        elevated: '#2A2C34',
        emerald: '#10B981',
        coral: '#EF4444'
      },
      boxShadow: {
        premium: '0 18px 50px rgba(30,31,36,.12)',
        float: '0 12px 30px rgba(36,72,255,.18)'
      }
    }
  },
  plugins: []
} satisfies Config
