import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Share, 
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllHealthData, exportHealthDataAsJSON, exportHealthDataAsCSV } from '../utils/storage';

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Export Your Data</Text>
        <Text style={styles.subtitle}>Download your health data in various formats</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Preparing your data...</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color="#6200ee" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Your health data belongs to you. Export it anytime to keep a backup or use it in other applications.
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Data Summary</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Entries:</Text>
              <Text style={styles.statValue}>{healthData.length}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>First Entry:</Text>
              <Text style={styles.statValue}>
                {healthData.length > 0 
                  ? new Date(healthData[0].timestamp).toLocaleDateString() 
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Latest Entry:</Text>
              <Text style={styles.statValue}>
                {healthData.length > 0 
                  ? new Date(healthData[healthData.length - 1].timestamp).toLocaleDateString() 
                  : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.exportOptions}>
            <Text style={styles.optionsTitle}>Export Options</Text>
            
            <TouchableOpacity 
              style={styles.exportButton}
              onPress={handleJSONExport}
              disabled={loading || healthData.length === 0}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="code-outline" size={24} color="white" />
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonTitle}>Export as JSON</Text>
                  <Text style={styles.buttonSubtitle}>Technical format for developers</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.exportButton, styles.csvButton]}
              onPress={handleCSVExport}
              disabled={loading || healthData.length === 0}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="document-text-outline" size={24} color="white" />
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonTitle}>Export as CSV</Text>
                  <Text style={styles.buttonSubtitle}>Compatible with spreadsheet apps</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.privacyNote}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#888" />
            <Text style={styles.privacyText}>
              Your data is exported directly from your device. No data is sent to any servers during this process.
            </Text>
          </View>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EDE7F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  exportOptions: {
    marginBottom: 16,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  csvButton: {
    backgroundColor: '#03DAC5',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buttonTextContainer: {
    marginLeft: 12,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  privacyNote: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  privacyText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ExportScreen;