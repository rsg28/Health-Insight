import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';

const ConfidenceIndicator = ({ level, dataPoints, onInfoPress }) => {
  const { theme, isDarkMode } = useTheme();
  
  const getConfidenceDetails = () => {
    // Adjust colors for better visibility in dark mode
    const highColor = isDarkMode ? '#5CDB95' : '#27ae60';
    const mediumColor = isDarkMode ? '#FFD966' : '#f39c12';
    const lowColor = isDarkMode ? '#FF7675' : '#e74c3c';
    
    if (level >= 0.8) {
      return {
        label: 'High Confidence',
        color: highColor,
        icon: 'checkmark-circle',
        bars: 3
      };
    } else if (level >= 0.5) {
      return {
        label: 'Medium Confidence',
        color: mediumColor,
        icon: 'alert-circle',
        bars: 2
      };
    } else {
      return {
        label: 'Low Confidence',
        color: lowColor,
        icon: 'information-circle',
        bars: 1
      };
    }
  };

  const details = getConfidenceDetails();
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      onPress={() => onInfoPress(
        `This insight is based on ${dataPoints} data points. ` +
        `The confidence level (${Math.round(level * 100)}%) reflects how reliable ` +
        `we believe this insight is based on your data consistency and sample size.`
      )}
    >
      <Ionicons name={details.icon} size={16} color={details.color} />
      <Text style={[styles.label, { color: details.color }]}>{details.label}</Text>
      <View style={styles.barsContainer}>
        {[1, 2, 3].map(i => (
          <View 
            key={i}
            style={[
              styles.bar, 
              { 
                backgroundColor: i <= details.bars ? details.color : theme.colors.divider 
              }
            ]} 
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent', // Use transparent initially and let theme handle it
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    marginRight: 8,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    width: 8,
    height: 12,
    marginHorizontal: 1,
    borderRadius: 1,
  },
});

export default ConfidenceIndicator;