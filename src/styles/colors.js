// Enhanced color palette for PolyLingo
export const colors = {
  // Primary colors - Vibrant Blue-Purple Gradient
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary color - Bright Blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Secondary colors - Teal to Emerald
  secondary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main secondary color - Emerald
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },

  // Accent colors - Vibrant Purple to Pink
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef', // Main accent color - Fuchsia
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e',
  },

  // Additional accent colors
  tertiary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Vibrant Orange
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },

  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Semantic colors
  success: '#22c55e', // Green
  warning: '#f59e0b', // Amber
  error: '#ef4444',   // Red
  info: '#3b82f6',    // Blue

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    secondary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    accent: 'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)',
    tertiary: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    cool: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #d946ef 100%)',
    warm: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    mixed: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #d946ef 75%, #f97316 100%)',
  },

  // Light mode background
  lightBg: '#f8fafc', // Slightly cooler white

  // Dark mode background
  darkBg: '#0f172a', // Deeper blue-black
};

// Theme configuration
export const theme = {
  light: {
    background: colors.lightBg,
    backgroundSecondary: '#ffffff',
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    card: '#ffffff',
    cardHover: '#ffffff',
    border: colors.neutral[200],
    borderHover: colors.neutral[300],
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    shadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  dark: {
    background: colors.darkBg,
    backgroundSecondary: '#1e293b', // Slate 800
    text: colors.neutral[100],
    textSecondary: colors.neutral[400],
    card: '#1e293b', // Slate 800
    cardHover: '#334155', // Slate 700
    border: '#334155', // Slate 700
    borderHover: '#475569', // Slate 600
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
    shadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
  }
};
