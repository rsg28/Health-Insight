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
import theme from '../utils/theme';

const HomeScreen = ({ navigation }) => {
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
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
        <View style={styles.header}>
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
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Health Summary</Text>
          
          <View style={styles.summaryContent}>
            {healthData.length > 0 ? (
              <Text style={styles.summaryText}>
                You've tracked your health for {healthData.length} {healthData.length === 1 ? 'day' : 'days'}.
              </Text>
            ) : (
              <Text style={styles.summaryText}>Start tracking your health today!</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('DataEntry')}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.addButtonText}>Add Today's Data</Text>
          </TouchableOpacity>
        </View>
        
        {healthData.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Ionicons name="fitness-outline" size={80} color={theme.colors.primary} />
            </View>
            <Text style={styles.emptyStateTitle}>No health data yet</Text>
            <Text style={styles.emptyStateText}>
              Add your first entry to start tracking your health journey
            </Text>
          </View>
        ) : (
          <View style={styles.metricsContainer}>
            <Text style={styles.sectionTitle}>Today's Metrics</Text>
            
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
              style={styles.insightsButton}
              onPress={() => navigation.navigate('ChartsTab')}
            >
              <Text style={styles.insightsButtonText}>View All Insights</Text>
              <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.privacyNote}>
          <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.text.hint} />
          <Text style={styles.privacyText}>
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
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.xl ,
    paddingBottom: theme.spacing.xl - 30,
    borderBottomLeftRadius: theme.borderRadius.l,
    borderBottomRightRadius: theme.borderRadius.l,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
  },
  greeting: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.light,
  },
  date: {
    fontSize: theme.typography.sizes.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: theme.spacing.xs,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginHorizontal: theme.spacing.m,
    marginTop: -theme.spacing.l + 40,
    ...theme.shadows.medium,
  },
  summaryTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.s,
  },
  summaryContent: {
    paddingVertical: theme.spacing.m,
  },
  summaryText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.s,
    marginTop: theme.spacing.s,
  },
  addButtonText: {
    color: theme.colors.text.light,
    fontWeight: theme.typography.fontWeights.medium,
    marginLeft: theme.spacing.s,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  emptyStateTitle: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.s,
  },
  emptyStateText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  metricsContainer: {
    padding: theme.spacing.m,
    marginTop: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.s,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  insightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.s,
    marginTop: theme.spacing.m,
  },
  insightsButtonText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
    marginRight: theme.spacing.s,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.divider,
    padding: theme.spacing.m,
    marginHorizontal: theme.spacing.m,
    marginTop: theme.spacing.l,
    borderRadius: theme.borderRadius.s,
  },
  privacyText: {
    marginLeft: theme.spacing.s,
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.text.secondary,
    flex: 1,
  },
});

export default HomeScreen;