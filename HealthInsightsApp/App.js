import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider } from './utils/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}