import React from 'react';
import { 
  StyleSheet, 
  View, 
  StatusBar,
  TouchableOpacity,
  Text,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DataEntryForm from '../components/DataEntryForm';
import { useTheme } from '../utils/ThemeContext';

const DataEntryScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  
  const handleSaveComplete = () => {
    // Navigate back to home screen after saving
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Health Data</Text>
      </View>

      <DataEntryForm onSaveComplete={handleSaveComplete} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#5D5FEF', // Using primary color
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default DataEntryScreen;