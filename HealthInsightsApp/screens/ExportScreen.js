import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Share, 
  Alert,
  ScrollView,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllHealthData, exportHealthDataAsJSON, exportHealthDataAsCSV } from '../utils/storage';
import theme from '../utils/theme';

const ExportScreen = () => {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to load data from storage
  const loadData = async () => {
    setLoading(true);
    const data = await getAllHealthData();
    setHealthData(data);
    setLoading(false);
  };

  // Export data as JSON
  const handleJSONExport = async () => {
    if (healthData.length === 0) {
      Alert.alert('No Data', 'There is no health data to export.');
      return;
    }

    setLoading(true);
    const jsonData = await exportHealthDataAsJSON();
    setLoading(false);

    if (jsonData) {
      try {
        await Share.share({
          message: jsonData,
          title: 'Health Insights Data (JSON)',
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to share data.');
      }
    } else {
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  // Export data as CSV
  const handleCSVExport = async () => {
    if (healthData.length === 0) {
      Alert.alert('No Data', 'There is no health data to export.');
      return;
    }

    setLoading(true);
    const csvData = await exportHealthDataAsCSV();
    setLoading(false);

    if (csvData) {
      try {
        await Share.share({
          message: csvData,
          title: 'Health Insights Data (CSV)',
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to share data.');
      }
    } else {
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Export Your Data</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Preparing your data...</Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons 
            name="information-circle-outline" 
            size={24} 
            color={theme.colors.primary} 
            style={styles.infoIcon} 
          />
          <Text style={styles.infoText}>
            Your health data belongs to you. Export it anytime to keep a backup 
            or use it in other applications.
          </Text>
        </View>

        <View style={styles.dataCard}>
          <Text style={styles.cardTitle}>Data Summary</Text>
          
          <View style={styles.dataRow}>
            <View style={styles.dataLabelContainer}>
              <Ionicons name="document-text-outline" size={18} color={theme.colors.text.secondary} />
              <Text style={styles.dataLabel}>Total Entries</Text>
            </View>
            <Text style={styles.dataValue}>{healthData.length}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.dataRow}>
            <View style={styles.dataLabelContainer}>
              <Ionicons name="calendar-outline" size={18} color={theme.colors.text.secondary} />
              <Text style={styles.dataLabel}>Date Range</Text>
            </View>
            <Text style={styles.dataValue}>
              {healthData.length > 0 
                ? `${new Date(healthData[0].timestamp).toLocaleDateString()} - ${new Date(healthData[healthData.length - 1].timestamp).toLocaleDateString()}`
                : 'No data'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Export Options</Text>
        
        <TouchableOpacity 
          style={[styles.exportButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleJSONExport}
          disabled={loading || healthData.length === 0}
        >
          <View style={styles.exportButtonContent}>
            <View style={styles.exportIconContainer}>
              <Ionicons name="code-outline" size={24} color="white" />
            </View>
            <View style={styles.exportTextContainer}>
              <Text style={styles.exportButtonTitle}>Export as JSON</Text>
              <Text style={styles.exportButtonSubtitle}>For developers or data analysis</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.exportButton, { backgroundColor: theme.colors.secondary }]}
          onPress={handleCSVExport}
          disabled={loading || healthData.length === 0}
        >
          <View style={styles.exportButtonContent}>
            <View style={styles.exportIconContainer}>
              <Ionicons name="grid-outline" size={24} color="white" />
            </View>
            <View style={styles.exportTextContainer}>
              <Text style={styles.exportButtonTitle}>Export as CSV</Text>
              <Text style={styles.exportButtonSubtitle}>For spreadsheets and Excel</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.privacyBox}>
          <View style={styles.privacyIconContainer}>
            <Ionicons name="shield-checkmark-outline" size={28} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.privacyTitle}>Privacy First</Text>
            <Text style={styles.privacyText}>
              Your data stays on your device until you choose to export it.
              No information is sent to external servers.
            </Text>
          </View>
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  dataCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    ...theme.shadows.small,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dataLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: 8,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: 24,
    marginBottom: 16,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exportButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exportTextContainer: {
    flex: 1,
  },
  exportButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  exportButtonSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  privacyBox: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  privacyIconContainer: {
    marginRight: 12,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  privacyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    maxWidth: '90%',
  }
});

export default ExportScreen;