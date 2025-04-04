import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import lightTheme from './theme';
import darkTheme from './DarkTheme';

const THEME_STORAGE_KEY = '@health_insights_app_theme';

// Create a context for the theme
export const ThemeContext = createContext({
  isDarkMode: false,
  theme: lightTheme,
  toggleTheme: () => {},
});

// Provider component to wrap the app
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  // Load saved theme on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Function to load the saved theme preference
  const loadThemePreference = async () => {
    try {
      const themePreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (themePreference !== null) {
        const isUserDarkMode = themePreference === 'dark';
        setIsDarkMode(isUserDarkMode);
        setTheme(isUserDarkMode ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  // Function to toggle between light and dark themes
  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      setTheme(newMode ? darkTheme : lightTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);