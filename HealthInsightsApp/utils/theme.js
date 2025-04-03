// A centralized theme for consistent styling across the app

const theme = {
    // Color palette
    colors: {
      primary: '#5D5FEF',          // Main purple color
      primaryLight: '#ECEDFB',     // Light purple for backgrounds
      primaryDark: '#4647BB',      // Darker purple for pressed states
      secondary: '#00BFA5',        // Teal accent color
      secondaryLight: '#E5F7F5',   // Light teal for backgrounds
      
      error: '#FF5252',            // Red for error states
      warning: '#FFC107',          // Yellow for warnings
      success: '#4CAF50',          // Green for success states
      
      background: '#FCFCFF',       // Slightly off-white for app background
      card: '#FFFFFF',             // Pure white for cards
      
      text: {
        primary: '#1A1C33',        // Almost black for primary text
        secondary: '#71727A',      // Medium gray for secondary text
        hint: '#9E9FAA',           // Lighter gray for hints/placeholders
        light: '#FFFFFF',          // White text for dark backgrounds
      },
      
      border: '#EBEBEF',           // Light gray for borders
      divider: '#F0F0F5',          // Very light gray for dividers
    },
    
    // Typography
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
    
    // Spacing
    spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 52,
      xxl: 48,
    },
    
    // Border radius
    borderRadius: {
      xs: 4,
      s: 8,
      m: 12,
      l: 16,
      xl: 24,
      circle: 100,
    },
    
    // Shadows
    shadows: {
      small: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
      },
    },
  };
  
  export default theme;