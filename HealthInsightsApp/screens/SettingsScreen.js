import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Switch, 
  Alert,
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { clearAllHealthData } from '../utils/storage';
import theme from '../utils/theme';

const SettingsScreen = () => {
  const [localStorageOnly, setLocalStorageOnly] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

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
    Alert.alert(
      "Privacy Policy",
      "This app respects your privacy. All health data is stored locally on your device and is never shared with third parties without your explicit consent.",
      [{ text: "OK" }]
    );
  };

  const renderSettingItem = (icon, title, description, value, onValueChange) => {
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={22} color={theme.colors.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
          thumbColor={value ? theme.colors.primary : '#f4f3f4'}
          ios_backgroundColor={theme.colors.border}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          
          {renderSettingItem(
            'lock-closed-outline',
            'Store Data Locally Only',
            'Keep all your health data on this device only',
            localStorageOnly,
            setLocalStorageOnly
          )}
          
          <View style={styles.divider} />
          
          {renderSettingItem(
            'notifications-outline',
            'Enable Notifications',
            'Receive reminders to log your daily health data',
            notificationsEnabled,
            setNotificationsEnabled
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          {renderSettingItem(
            'moon-outline',
            'Dark Mode',
            'Switch between light and dark app theme',
            darkModeEnabled,
            setDarkModeEnabled
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleClearData}
            disabled={isClearing}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="trash-outline" size={22} color="#F44336" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Clear All Health Data</Text>
              <Text style={styles.actionDescription}>
                Remove all your health data from this device
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text.hint} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleOpenPrivacyPolicy}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Privacy Policy</Text>
              <Text style={styles.actionDescription}>
                Learn how we protect your data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text.hint} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Health Insights App</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 All Rights Reserved</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 68,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  appVersion: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: theme.colors.text.hint,
    marginTop: 8,
  }
});

export default SettingsScreen;