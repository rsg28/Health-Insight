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
import { useTheme } from '../utils/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [localStorageOnly, setLocalStorageOnly] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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
      <View style={[styles.settingItem, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryLight }]}>
          <Ionicons name={icon} size={22} color={theme.colors.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>{title}</Text>
          <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>{description}</Text>
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.primary} />
      
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, borderBottomColor: theme.colors.border }]}>
            Privacy & Data
          </Text>
          
          {renderSettingItem(
            'lock-closed-outline',
            'Store Data Locally Only',
            'Keep all your health data on this device only',
            localStorageOnly,
            setLocalStorageOnly
          )}
          
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          {renderSettingItem(
            'notifications-outline',
            'Enable Notifications',
            'Receive reminders to log your daily health data',
            notificationsEnabled,
            setNotificationsEnabled
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, borderBottomColor: theme.colors.border }]}>
            Appearance
          </Text>
          
          {renderSettingItem(
            'moon-outline',
            'Dark Mode',
            'Switch between light and dark app theme',
            isDarkMode,
            toggleTheme
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, borderBottomColor: theme.colors.border }]}>
            Data Management
          </Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('DataManagement')}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="shield-outline" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.colors.text.primary }]}>Data Privacy Controls</Text>
              <Text style={[styles.actionDescription, { color: theme.colors.text.secondary }]}>
                Manage your data with granular privacy settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text.hint} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('HowItWorks')}
          >
            <View style={[styles.actionIcon, { backgroundColor: isDarkMode ? '#1A3A4A' : '#E8F4FD' }]}>
              <Ionicons name="information-circle-outline" size={22} color={isDarkMode ? '#4DB6F0' : '#2980b9'} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.colors.text.primary }]}>How This App Works</Text>
              <Text style={[styles.actionDescription, { color: theme.colors.text.secondary }]}>
                Learn how your data is used to generate insights
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text.hint} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, borderBottomColor: theme.colors.border }]}>
            About
          </Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleOpenPrivacyPolicy}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.colors.text.primary }]}>Privacy Policy</Text>
              <Text style={[styles.actionDescription, { color: theme.colors.text.secondary }]}>
                Learn how we protect your data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text.hint} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.appInfo}>
          <Text style={[styles.appName, { color: theme.colors.text.primary }]}>Health Insights App</Text>
          <Text style={[styles.appVersion, { color: theme.colors.text.secondary }]}>Version 1.0.0</Text>
          <Text style={[styles.appCopyright, { color: theme.colors.text.hint }]}>© 2025 All Rights Reserved</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
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
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
  },
  divider: {
    height: 1,
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
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  appVersion: {
    fontSize: 14,
    marginTop: 4,
  },
  appCopyright: {
    fontSize: 12,
    marginTop: 8,
  }
});

export default SettingsScreen;