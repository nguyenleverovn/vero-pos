import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e9f2ff',
          100: '#c7dcff',
          200: '#a1c3ff',
          300: '#7aa9ff',
          400: '#5891fb',
          500: '#2d6ce5',
          600: '#1f57c7',
          700: '#1843a4',
          800: '#13337f',
          900: '#0b2a66'
        },
        surface: '#f8fafc',
        border: '#d2dcff',
        success: '#10b981',
        warning: '#f59e0b'
      },
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.375rem',
        'md': '0.625rem',
        'lg': '0.875rem',
        'xl': '1.125rem'
      },
      boxShadow: {
        card: '0 10px 24px rgba(13, 33, 87, 0.08)',
        floating: '0 12px 30px rgba(13, 33, 87, 0.14)'
      },
      screens: {
        sm: '390px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      }
    }
  },
  plugins: []
}

export default config
