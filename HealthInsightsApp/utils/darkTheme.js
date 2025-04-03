// A dark theme version for the app

const darkTheme = {
    // Color palette
    colors: {
      primary: '#6D71FB',          // Slightly lighter purple for dark mode
      primaryLight: '#2E2F47',     // Darker shade for backgrounds in dark mode
      primaryDark: '#5658DD',      // Slightly lighter purple for pressed states
      secondary: '#00D6B9',        // Brighter teal for dark mode
      secondaryLight: '#1F3735',   // Dark teal for backgrounds
      
      error: '#FF6B6B',            // Brighter red for error states in dark mode
      warning: '#FFD166',          // Brighter yellow for warnings
      success: '#5CDB95',          // Brighter green for success states
      
      background: '#121212',       // Dark background
      card: '#1E1E1E',             // Slightly lighter cards on dark background
      
      text: {
        primary: '#FFFFFF',        // White for primary text
        secondary: '#B0B0B8',      // Light gray for secondary text
        hint: '#78787F',           // Darker gray for hints/placeholders
        light: '#FFFFFF',          // White text for dark backgrounds
      },
      
      border: '#2C2C2E',           // Dark gray for borders
      divider: '#2C2C2E',          // Dark gray for dividers
    },
    
    // Typography - keeping the same values
    typography: {
      fontWeights: {
        regular: '400',
        medium: '500',
        bold: '700',
      },
      sizes: {
        h1: 24,
        h2: 20,
        h3: 18,
        body: 16,
        caption: 14,
        small: 12,
      },
    },
    
    // Spacing - keeping the same values
    spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 52,
      xxl: 48,
    },
    
    // Border radius - keeping the same values
    borderRadius: {
      xs: 4,
      s: 8,
      m: 12,
      l: 16,
      xl: 24,
      circle: 100,
    },
    
    // Shadows - adjusted for dark mode
    shadows: {
      small: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 9,
      },
    },
  };
  
  export default darkTheme;