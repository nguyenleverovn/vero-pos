export const designTokens = {
  colors: {
    primary: '#2d6ce5',
    secondary: '#1f57c7',
    background: '#f3f6ff',
    surface: '#f8f9fc',
    text: '#0f1d3a',
    mutedText: '#51608d',
    border: '#d3ddff',
    success: '#1fa34d',
    warning: '#f5a524'
  },
  typography: {
    fontHeading: 'Trebuchet MS, Segoe UI, Arial',
    fontBody: 'Inter, Segoe UI, Arial'
  },
  spacing: {
    unit: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32
  },
  radius: {
    small: '0.5rem',
    medium: '0.875rem',
    large: '1.25rem'
  },
  breakpoints: {
    mobile: 390,
    tabletMin: 768,
    tabletMax: 1024,
    desktop: 1280
  }
} as const

export type DesignTokenKey = keyof typeof designTokens
