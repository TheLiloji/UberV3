export const theme = {
  colors: {
    text: '#11181C',
    textSecondary: '#666666',
    background: '#fff',
    backgroundSecondary: '#f8f8f8',
    primary: '#f6b44c',
    border: '#f0f0f0',
    tint: '#0a7ea4',
    icon: '#687076',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
  },
  typography: {
    title: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      color: '#666666',
    }
  }
} as const;

// Hook simplifié qui retourne toujours le thème clair
export function useTheme() {
  return theme;
} 