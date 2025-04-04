import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';

const ContextFlagsDisplay = ({ contextFlags = [] }) => {
  const { theme } = useTheme();
  
  if (!contextFlags || contextFlags.length === 0) {
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
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.secondary }]}>Today's Context:</Text>
      <View style={styles.flagsContainer}>
        {contextFlags.map(flag => (
          <View 
            key={flag} 
            style={[styles.flagBadge, { backgroundColor: theme.colors.primaryLight }]}
          >
            <Ionicons name={contextOptions[flag]?.icon || 'information-circle-outline'} size={14} color={theme.colors.primary} />
            <Text style={[styles.flagLabel, { color: theme.colors.primary }]}>
              {contextOptions[flag]?.label || flag}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  flagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  flagLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  }
});

export default ContextFlagsDisplay;