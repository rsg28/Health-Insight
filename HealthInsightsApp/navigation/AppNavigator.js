import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import DataEntryScreen from '../screens/DataEntryScreen';
import ChartsScreen from '../screens/ChartsScreen';
import ExportScreen from '../screens/ExportScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import DataManagementScreen from '../screens/DataManagementScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home stack for dashboard and related screens
const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Health Dashboard' }} 
      />
      <Stack.Screen 
        name="DataEntry" 
        component={DataEntryScreen} 
        options={{ title: 'Add Health Data' }} 
      />
      <Stack.Screen 
        name="HowItWorks" 
        component={HowItWorksScreen} 
        options={{ title: 'How It Works' }} 
      />
    </Stack.Navigator>
  );
};

// Charts stack for data visualization screens
const ChartsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Charts" 
        component={ChartsScreen} 
        options={{ title: 'Health Insights' }} 
      />
    </Stack.Navigator>
  );
};

// Export stack for data export functionality
const ExportStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Export" 
        component={ExportScreen} 
        options={{ title: 'Export Your Data' }} 
      />
    </Stack.Navigator>
  );
};

// Settings stack for app settings and privacy controls
const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'App Settings' }} 
      />
      <Stack.Screen 
        name="DataManagement" 
        component={DataManagementScreen} 
        options={{ title: 'Data Management' }} 
      />
      <Stack.Screen 
        name="HowItWorks" 
        component={HowItWorksScreen} 
        options={{ title: 'How It Works' }} 
      />
    </Stack.Navigator>
  );
};

// Main app navigation with bottom tabs
const AppNavigator = () => {
  const { theme, isDarkMode } = useTheme();
  
  // Create a custom theme that extends the default navigation theme
  const customTheme = {
    // Start with the appropriate base theme
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    // Override with our custom colors
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text.primary,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
    // These are the font properties React Navigation expects
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      light: {
        fontFamily: 'System',
        fontWeight: '300',
      },
      thin: {
        fontFamily: 'System',
        fontWeight: '100',
      },
    },
  };
  
  return (
    <NavigationContainer theme={customTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'ChartsTab') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'ExportTab') {
              iconName = focused ? 'download' : 'download-outline';
            } else if (route.name === 'SettingsTab') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text.hint,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="HomeTab" 
          component={HomeStack} 
          options={{ title: 'Dashboard' }} 
        />
        <Tab.Screen 
          name="ChartsTab" 
          component={ChartsStack} 
          options={{ title: 'Insights' }} 
        />
        <Tab.Screen 
          name="ExportTab" 
          component={ExportStack} 
          options={{ title: 'Export' }} 
        />
        <Tab.Screen 
          name="SettingsTab" 
          component={SettingsStack} 
          options={{ title: 'Settings' }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;