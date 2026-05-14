import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette uses CSS variables so the runtime TweaksPanel can swap it.
        primary: {
          DEFAULT: 'var(--c-primary)',
          dark: 'var(--c-primary-dark)',
          light: 'var(--c-primary-light)',
        },
        ai: {
          DEFAULT: 'var(--c-ai)',
          dark: 'var(--c-ai-dark)',
          light: 'var(--c-ai-light)',
        },
        sale: '#EC4899',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        ink: {
          900: '#111827',
          700: '#374151',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
          50: '#F9FAFB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        display: ['36px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['30px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '1.35', fontWeight: '600' }],
        h4: ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.6' }],
        body: ['14px', { lineHeight: '1.6' }],
        small: ['12px', { lineHeight: '1.5' }],
        caption: ['11px', { letterSpacing: '0.05em', fontWeight: '500' }],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        hover: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
        modal: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: { fadeInUp: 'fadeInUp 0.28s ease both' },
    },
  },
  plugins: [],
};

export default config;
