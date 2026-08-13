import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './public/**/*.html'],
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
        secondary: {
          50: '#f2f6ff',
          100: '#d8e3ff',
          200: '#aebef8',
          300: '#8092e8',
          400: '#5670d4',
          500: '#3046ba',
          600: '#27389c',
          700: '#202d84',
          800: '#1a2470',
          900: '#141a5f'
        },
        background: '#f3f6ff',
        surface: '#f8f9fc',
        foreground: '#0f1d3a',
        muted: '#51608d',
        border: '#d3ddff',
        success: '#1fa34d',
        warning: '#f5a524'
      },
      borderRadius: {
        sm: 'var(--radius-small)',
        md: 'var(--radius-medium)',
        lg: 'var(--radius-large)'
      },
      fontFamily: {
        sans: ['"Trebuchet MS"', '"Segoe UI"', 'Arial', 'sans-serif'],
        heading: ['"Trebuchet MS"', '"Segoe UI"', 'Arial', 'sans-serif'],
        body: ['Inter', '"Segoe UI"', 'Arial', 'sans-serif']
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)'
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
