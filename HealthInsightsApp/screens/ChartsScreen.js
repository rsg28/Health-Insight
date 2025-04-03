import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import LineChartComponent from '../components/LineChartComponent';
import { getAllHealthData } from '../utils/storage';
import { formatDataForLineChart, generateBasicInsights, getHealthRecommendations } from '../utils/dataUtils';

const ChartsScreen = () => {
  const [healthData, setHealthData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('steps');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to load data from storage
  const loadData = async () => {
    setRefreshing(true);
    const data = await getAllHealthData();
    setHealthData(data);
    setRefreshing(false);
  };

  // Get average value for the selected metric
  const getAverageValue = () => {
    if (healthData.length === 0) return 0;
    
    const sum = healthData.reduce((acc, item) => acc + (item[selectedMetric] || 0), 0);
    return (sum / healthData.length).toFixed(1);
  };

  const getChartData = () => {
    return formatDataForLineChart(healthData, selectedMetric);
  };

  const getYAxisLabel = () => {
    switch (selectedMetric) {
      case 'steps': return '';
      case 'sleepHours': return '';
      case 'waterIntake': return '';
      case 'mood': return '';
      default: return '';
    }
  };

  const getYAxisSuffix = () => {
    switch (selectedMetric) {
      case 'steps': return '';
      case 'sleepHours': return 'h';
      case 'waterIntake': return '';
      case 'mood': return '';
      default: return '';
    }
  };

  const getChartColor = () => {
    switch (selectedMetric) {
      case 'steps': return '#4CAF50';
      case 'sleepHours': return '#2196F3';
      case 'waterIntake': return '#00BCD4';
      case 'mood': return '#FF9800';
      default: return '#6200ee';
    }
  };

  const getMetricTitle = () => {
    switch (selectedMetric) {
      case 'steps': return 'Steps';
      case 'sleepHours': return 'Sleep Hours';
      case 'waterIntake': return 'Water Intake (glasses)';
      case 'mood': return 'Mood (1-5)';
      default: return selectedMetric;
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadData} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Health Insights</Text>
        <Text style={styles.subtitle}>Visualize your health trends</Text>
      </View>
      
      <View style={styles.metricsButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.metricButton, 
            selectedMetric === 'steps' && styles.selectedMetricButton,
            { backgroundColor: selectedMetric === 'steps' ? '#4CAF50' : '#f0f0f0' }
          ]}
          onPress={() => setSelectedMetric('steps')}
        >
          <Text style={[
            styles.metricButtonText,
            selectedMetric === 'steps' && styles.selectedMetricButtonText
          ]}>Steps</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.metricButton, 
            selectedMetric === 'sleepHours' && styles.selectedMetricButton,
            { backgroundColor: selectedMetric === 'sleepHours' ? '#2196F3' : '#f0f0f0' }
          ]}
          onPress={() => setSelectedMetric('sleepHours')}
        >
          <Text style={[
            styles.metricButtonText,
            selectedMetric === 'sleepHours' && styles.selectedMetricButtonText
          ]}>Sleep</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.metricButton, 
            selectedMetric === 'waterIntake' && styles.selectedMetricButton,
            { backgroundColor: selectedMetric === 'waterIntake' ? '#00BCD4' : '#f0f0f0' }
          ]}
          onPress={() => setSelectedMetric('waterIntake')}
        >
          <Text style={[
            styles.metricButtonText,
            selectedMetric === 'waterIntake' && styles.selectedMetricButtonText
          ]}>Water</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.metricButton, 
            selectedMetric === 'mood' && styles.selectedMetricButton,
            { backgroundColor: selectedMetric === 'mood' ? '#FF9800' : '#f0f0f0' }
          ]}
          onPress={() => setSelectedMetric('mood')}
        >
          <Text style={[
            styles.metricButtonText,
            selectedMetric === 'mood' && styles.selectedMetricButtonText
          ]}>Mood</Text>
        </TouchableOpacity>
      </View>
      
      {healthData.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No data available. Add some health data to see insights.
          </Text>
        </View>
      ) : (
        <View>
          <LineChartComponent
            data={getChartData()}
            title={`${getMetricTitle()} Over Time`}
            yAxisLabel={getYAxisLabel()}
            yAxisSuffix={getYAxisSuffix()}
            color={getChartColor()}
          />
          
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Your Insights</Text>
            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>Average:</Text>
              <Text style={styles.insightValue}>
                {getAverageValue()} {getYAxisSuffix()}
              </Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.insightText}>
              {generateBasicInsights(healthData, selectedMetric)}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.recommendationText}>
              {getHealthRecommendations(selectedMetric, getAverageValue())}
            </Text>
          </View>
        </View>
      )}
      
      <View style={styles.privacyNote}>
        <Text style={styles.privacyText}>
          These basic insights are generated from your local data only and are meant as general information, not medical advice.
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
  metricsButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  metricButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedMetricButton: {
    elevation: 3,
  },
  metricButtonText: {
    fontSize: 14,
    color: '#555',
  },
  selectedMetricButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  insightCard: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  insightLabel: {
    fontSize: 14,
    color: '#555',
  },
  insightValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  recommendationText: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '500',
    lineHeight: 20,
  },
  privacyNote: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  privacyText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default ChartsScreen;