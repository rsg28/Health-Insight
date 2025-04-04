import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import ConfidenceIndicator from './ConfidenceIndicator';

const ContextInsights = ({ insights, metric }) => {
  const { theme } = useTheme();
  
  if (!insights || insights.length === 0) {
    return null;
  }
  
  // Map of context flags to their icons and labels
  const contextOptions = {
    'travel': { icon: 'airplane-outline', label: 'Traveling' },
    'illness': { icon: 'medkit-outline', label: 'Illness' },
    'stress': { icon: 'flash-outline', label: 'High Stress' },
    'exercise': { icon: 'fitness-outline', label: 'Extra Exercise' },
    'relaxation': { icon: 'leaf-outline', label: 'Rest Day' }
  };
  
  // Get friendly metric name
  const getMetricName = () => {
    switch(metric) {
      case 'steps': return 'step count';
      case 'sleepHours': return 'sleep duration';
      case 'waterIntake': return 'water intake';
      case 'mood': return 'mood';
      default: return metric;
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Context Analysis</Text>
      
      {insights.map((insight, index) => (
        <View key={index} style={styles.insightRow}>
          <View style={styles.contextBadge}>
            <Ionicons 
              name={contextOptions[insight.context]?.icon || 'information-circle-outline'} 
              size={18} 
              color={theme.colors.primary} 
            />
          </View>
          
          <View style={styles.insightContent}>
            <Text style={[styles.insightText, { color: theme.colors.text.secondary }]}>
              When <Text style={styles.highlightText}>{contextOptions[insight.context]?.label || insight.context}</Text>, 
              your {getMetricName()} is typically {insight.impact} by {insight.difference} 
              {metric === 'sleepHours' ? ' hours' : ''}
              {metric === 'steps' ? ' steps' : ''}
              {metric === 'waterIntake' ? ' glasses' : ''}.
            </Text>
          </View>
          
          <View style={styles.confidenceContainer}>
            <ConfidenceIndicator level={insight.confidence} dataPoints={5} onInfoPress={() => {}} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  insightRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  contextBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(93, 95, 239, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  highlightText: {
    fontWeight: '600',
  },
  confidenceContainer: {
    marginLeft: 8,
  }
});

export default ContextInsights;