import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  getAllHealthData, 
  deleteHealthDataByDateRange, 
  clearAllHealthData 
} from '../utils/storage';
import { getPrivacySettings, updatePrivacySettings } from '../utils/userPreferences';
import theme from '../utils/theme';

const DataManagementScreen = ({ navigation }) => {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    dataRetentionDays: 365,
    shareAnonymousData: false
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    loadData();
    loadPrivacySettings();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getAllHealthData();
    setHealthData(data);
    setLoading(false);
  };

  const loadPrivacySettings = async () => {
    const settings = await getPrivacySettings();
    setPrivacySettings(settings);
  };

  const handleToggleAnonymousData = async (value) => {
    setPrivacySettings(prev => ({ ...prev, shareAnonymousData: value }));
    await updatePrivacySettings({ shareAnonymousData: value });
  };

  const handleUpdateRetentionDays = async (days) => {
    setPrivacySettings(prev => ({ ...prev, dataRetentionDays: days }));
    await updatePrivacySettings({ dataRetentionDays: days });
  };

  const handleSelectDateRange = () => {
    // Show date range picker dialog (simplified for this example)
    Alert.alert(
      "Select Date Range",
      "This would open a date range picker. For simplicity, we're using a 30-day range in this example.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Use Last 30 Days", 
          onPress: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 30);
            setStartDate(start);
            setEndDate(end);
          }
        }
      ]
    );
  };

  const showDeleteConfirmation = (type) => {
    let message = "";
    
    if (type === "date_range") {
      message = `Delete all health data between ${startDate.toLocaleDateString()} and ${endDate.toLocaleDateString()}?`;
    } else if (type === "all") {
      message = "Delete ALL your health data? This action cannot be undone.";
    }
    
    Alert.alert(
      "Confirm Deletion",
      message,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => type === "date_range" ? handleDeleteByDate() : handleDeleteAll()
        }
      ]
    );
  };

  const handleDeleteByDate = async () => {
    setLoading(true);
    
    const success = await deleteHealthDataByDateRange(startDate, endDate);
    
    setLoading(false);
    
    if (success) {
      Alert.alert(
        "Data Deleted",
        `Health data between ${startDate.toLocaleDateString()} and ${endDate.toLocaleDateString()} has been deleted.`
      );
      loadData();
    } else {
      Alert.alert("Error", "There was a problem deleting your data. Please try again.");
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    
    const success = await clearAllHealthData();
    
    setLoading(false);
    
    if (success) {
      Alert.alert("Data Deleted", "All your health data has been deleted.");
      loadData();
    } else {
      Alert.alert("Error", "There was a problem deleting your data. Please try again.");
    }
  };

  const getDataImpactSummary = () => {
    if (healthData.length === 0) {
      return "No data available.";
    }

    return `You have ${healthData.length} data entries. Deleting all data will remove your ability to see trends and insights.`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Management</Text>
      </View>
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Control</Text>
          <Text style={styles.sectionDescription}>
            Manage your health data with granular controls. You own your data and can delete it at any time.
          </Text>
          
          <View style={styles.dataCard}>
            <View style={styles.dataHeaderRow}>
              <Ionicons name="analytics-outline" size={22} color={theme.colors.primary} />
              <Text style={styles.dataHeaderText}>Data Impact Preview</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.dataImpactText}>{getDataImpactSummary()}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSelectDateRange()}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="calendar-outline" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Delete Data by Date Range</Text>
              <Text style={styles.actionDescription}>
                Selectively remove data from a specific time period
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text.hint} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.destructiveAction]}
            onPress={() => showDeleteConfirmation("all")}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="trash-outline" size={22} color="#F44336" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, styles.destructiveText]}>Delete All Health Data</Text>
              <Text style={styles.actionDescription}>
                Permanently remove all your health data from this device
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text.hint} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention Policy</Text>
          <Text style={styles.sectionDescription}>
            Configure how long your data is kept on your device.
          </Text>
          
          <View style={styles.optionRow}>
            <View style={styles.optionLabelContainer}>
              <Ionicons name="time-outline" size={22} color={theme.colors.primary} />
              <Text style={styles.optionLabel}>Data Retention Period</Text>
            </View>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => {
                Alert.alert(
                  "Select Retention Period",
                  "Choose how long to keep your data",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "90 days", onPress: () => handleUpdateRetentionDays(90) },
                    { text: "1 year", onPress: () => handleUpdateRetentionDays(365) },
                    { text: "Forever", onPress: () => handleUpdateRetentionDays(0) }
                  ]
                );
              }}
            >
              <Text style={styles.selectButtonText}>
                {privacySettings.dataRetentionDays === 0 ? 
                  "Forever" : 
                  `${privacySettings.dataRetentionDays} days`
                }
              </Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.optionRow}>
            <View style={styles.optionLabelContainer}>
              <Ionicons name="analytics-outline" size={22} color={theme.colors.primary} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>Contribute Anonymous Patterns</Text>
                <Text style={styles.optionDescription}>
                  Share anonymous usage patterns to help improve recommendations
                </Text>
              </View>
            </View>
            <Switch
              value={privacySettings.shareAnonymousData}
              onValueChange={handleToggleAnonymousData}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={privacySettings.shareAnonymousData ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.privacyNote}>
          <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.text.hint} />
          <Text style={styles.privacyText}>
            Your privacy is our priority. All data remains on your device unless you explicitly choose to share it.
          </Text>
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  dataCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dataHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },
  dataImpactText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  destructiveAction: {
    borderColor: '#FFCDD2',
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
    marginRight: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  destructiveText: {
    color: '#F44336',
  },
  actionDescription: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  optionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: 12,
  },
  optionDescription: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  privacyNote: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  privacyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default DataManagementScreen;