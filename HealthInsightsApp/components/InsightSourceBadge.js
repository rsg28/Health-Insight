import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../utils/theme';

const InsightSourceBadge = ({ source, onInfoPress }) => {
  const getSourceConfig = () => {
    switch (source) {
      case 'user_data':
        return {
          icon: 'person-outline',
          label: 'From Your Data',
          color: theme.colors.primary,
          description: 'This insight is generated directly from your personal data history.'
        };
      case 'general':
        return {
          icon: 'globe-outline',
          label: 'General Guideline',
          color: '#8e44ad',
          description: 'This insight is based on general health guidelines, not your specific data.'
        };
      case 'research':
        return {
          icon: 'school-outline',
          label: 'Research-Based',
          color: '#2980b9',
          description: 'This insight is based on peer-reviewed health research.'
        };
      default:
        return {
          icon: 'information-circle-outline',
          label: 'Insight',
          color: theme.colors.secondary,
          description: 'Source information unavailable.'
        };
    }
  };

  const config = getSourceConfig();

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon} size={12} color={config.color} />
        <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
      </View>
      <TouchableOpacity 
        style={styles.infoButton} 
        onPress={() => onInfoPress(config.description)}
      >
        <Ionicons name="information-circle-outline" size={16} color={theme.colors.text.hint} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  infoButton: {
    padding: 2,
  },
});

export default InsightSourceBadge;