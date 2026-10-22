/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f7f8fb',
        night: '#0b0f19',
        surface: '#ffffff',
        'surface-dark': '#131826',
        glass: 'rgba(255, 255, 255, 0.6)',
        primary: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        accent: {
          DEFAULT: '#14b8a6',
          500: '#14b8a6',
          600: '#0d9488',
        },
        muted: '#6b7280',
        'muted-dark': '#9ca3af',
        border: {
          subtle: '#e5e7eb',
          default: '#d1d5db',
          dark: '#232a3b',
        },
        success: { light: '#dcfce7', dark: '#16a34a' },
        warning: { light: '#fef3c7', dark: '#d97706' },
        danger: { light: '#fee2e2', dark: '#dc2626' },
        info: { light: '#dbeafe', dark: '#2563eb' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-lg': '0 10px 30px -10px rgba(99,102,241,0.25)',
        glass: '0 8px 32px 0 rgba(31,38,135,0.15)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #14b8a6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
      },
    },
  },
  plugins: [],
}
