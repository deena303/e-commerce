import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
        },
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
