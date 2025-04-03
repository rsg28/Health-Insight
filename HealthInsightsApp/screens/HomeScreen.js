import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HealthMetricCard from '../components/HealthMetricCard';
import { getAllHealthData } from '../utils/storage';
import { calculateDailyAverages } from '../utils/dataUtils';
import { useTheme } from '../utils/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [healthData, setHealthData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [todayData, setTodayData] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to load data from storage
  const loadData = async () => {
    setRefreshing(true);
    const data = await getAllHealthData();
    setHealthData(data);
    
    // Get today's data (latest entry)
    if (data.length > 0) {
      const sortedData = [...data].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      setTodayData(sortedData[0]);
    }
    
    setRefreshing(false);
  };

  // Get average values or latest values
  const getMetricValue = (metric) => {
    if (!todayData) return 0;
    return todayData[metric] || 0;
  };

  // Get current date in readable format
  const getCurrentDate = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.primary} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadData} 
            colors={[theme.colors.primary]} 
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hello!</Text>
              <Text style={styles.date}>{getCurrentDate()}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('SettingsTab')}
            >
              <Ionicons name="person-circle" size={40} color={theme.colors.text.light} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.summaryTitle, { color: theme.colors.text.primary }]}>Your Health Summary</Text>
          
          <View style={styles.summaryContent}>
            {healthData.length > 0 ? (
              <Text style={[styles.summaryText, { color: theme.colors.text.secondary }]}>
                You've tracked your health for {healthData.length} {healthData.length === 1 ? 'day' : 'days'}.
              </Text>
            ) : (
              <Text style={[styles.summaryText, { color: theme.colors.text.secondary }]}>Start tracking your health today!</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.colors.secondary }]}
            onPress={() => navigation.navigate('DataEntry')}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.addButtonText}>Add Today's Data</Text>
          </TouchableOpacity>
        </View>
        
        {healthData.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyStateIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="fitness-outline" size={80} color={theme.colors.primary} />
            </View>
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text.primary }]}>No health data yet</Text>
            <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
              Add your first entry to start tracking your health journey
            </Text>
          </View>
        ) : (
          <View style={styles.metricsContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Today's Metrics</Text>
            
            <View style={styles.metricsGrid}>
              <HealthMetricCard
                title="Steps"
                value={getMetricValue('steps')}
                unit="steps"
                icon="footsteps-outline"
                color="#4CAF50"
                onPress={() => navigation.navigate('ChartsTab', { initialMetric: 'steps' })}
              />
              
              <HealthMetricCard
                title="Sleep"
                value={getMetricValue('sleepHours')}
                unit="hours"
                icon="moon-outline"
                color="#2196F3"
                onPress={() => navigation.navigate('ChartsTab', { initialMetric: 'sleepHours' })}
              />
            </View>
            
            <View style={styles.metricsGrid}>
              <HealthMetricCard
                title="Water"
                value={getMetricValue('waterIntake')}
                unit="glasses"
                icon="water-outline"
                color="#00BCD4"
                onPress={() => navigation.navigate('ChartsTab', { initialMetric: 'waterIntake' })}
              />
              
              <HealthMetricCard
                title="Mood"
                value={getMetricValue('mood')}
                unit="/5"
                icon="happy-outline"
                color="#FF9800"
                onPress={() => navigation.navigate('ChartsTab', { initialMetric: 'mood' })}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.insightsButton, { backgroundColor: theme.colors.primaryLight }]}
              onPress={() => navigation.navigate('ChartsTab')}
            >
              <Text style={[styles.insightsButtonText, { color: theme.colors.primary }]}>View All Insights</Text>
              <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={[styles.privacyNote, { backgroundColor: theme.colors.divider }]}>
          <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.text.hint} />
          <Text style={[styles.privacyText, { color: theme.colors.text.secondary }]}>
            Your health data is stored locally on your device for privacy.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 52,
  },
  header: {
    paddingTop: 52,
    paddingBottom: 22,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryContent: {
    paddingVertical: 16,
  },
  summaryText: {
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 52,
    marginTop: 52,
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  metricsContainer: {
    padding: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  insightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  insightsButtonText: {
    fontWeight: '500',
    marginRight: 8,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 8,
  },
  privacyText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
});

export default HomeScreen;