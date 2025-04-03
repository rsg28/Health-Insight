import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Switch, 
  Alert,
  ScrollView,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { clearAllHealthData } from '../utils/storage';

const SettingsScreen = () => {
  const [localStorageOnly, setLocalStorageOnly] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Handle clear data
  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all your health data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear All Data",
          style: "destructive",
          onPress: async () => {
            setIsClearing(true);
            await clearAllHealthData();
            setIsClearing(false);
            Alert.alert(
              "Data Cleared",
              "All your health data has been cleared from this device."
            );
          }
        }
      ]
    );
  };

  // Handle opening privacy policy
  const handleOpenPrivacyPolicy = () => {
    // This would normally link to your privacy policy page
    Alert.alert(
      "Privacy Policy",
      "This app respects your privacy. All health data is stored locally on your device and is never shared with third parties without your explicit consent.",
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Privacy and data controls</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Store Data Locally Only</Text>
            <Text style={styles.settingDescription}>
              Keep all your health data on this device only
            </Text>
          </View>
          <Switch
            value={localStorageOnly}
            onValueChange={setLocalStorageOnly}
            trackColor={{ false: '#ccc', true: '#03DAC5' }}
            thumbColor={localStorageOnly ? '#6200ee' : '#f4f3f4'}
            ios_backgroundColor="#ccc"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Enable Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive reminders to log your daily health data
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#ccc', true: '#03DAC5' }}
            thumbColor={notificationsEnabled ? '#6200ee' : '#f4f3f4'}
            ios_backgroundColor="#ccc"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Switch between light and dark app theme
            </Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#ccc', true: '#03DAC5' }}
            thumbColor={darkModeEnabled ? '#6200ee' : '#f4f3f4'}
            ios_backgroundColor="#ccc"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleClearData}
          disabled={isClearing}
        >
          <Ionicons name="trash-outline" size={22} color="#FF5252" />
          <Text style={[styles.buttonText, { color: '#FF5252' }]}>
            {isClearing ? 'Clearing...' : 'Clear All Health Data'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleOpenPrivacyPolicy}
        >
          <Ionicons name="shield-checkmark-outline" size={22} color="#6200ee" />
          <Text style={styles.buttonText}>Privacy Policy</Text>
        </TouchableOpacity>
        
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Health Insights App</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoCopyright}>© 2025 All Rights Reserved</Text>
        </View>
      </View>

      <View style={styles.privacyNote}>
        <Ionicons name="information-circle-outline" size={22} color="#888" />
        <Text style={styles.privacyText}>
          This app is designed with privacy in mind. Your health data never leaves your device unless you explicitly export it.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 16,
    backgroundColor: '#6200ee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buttonText: {
    fontSize: 16,
    color: '#6200ee',
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  appInfoCopyright: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  privacyNote: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default SettingsScreen;