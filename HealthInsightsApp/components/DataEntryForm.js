import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveHealthData } from '../utils/storage';
import theme from '../utils/theme';

const DataEntryForm = ({ onSaveComplete }) => {
  const [steps, setSteps] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [mood, setMood] = useState(3); // Default to middle value
  const [notes, setNotes] = useState('');
  const [selectedContexts, setSelectedContexts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const contextOptions = [
    { id: 'travel', icon: 'airplane-outline', label: 'Traveling' },
    { id: 'illness', icon: 'medkit-outline', label: 'Illness' },
    { id: 'stress', icon: 'flash-outline', label: 'High Stress' },
    { id: 'exercise', icon: 'fitness-outline', label: 'Extra Exercise' },
    { id: 'relaxation', icon: 'leaf-outline', label: 'Rest Day' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    const healthData = {
      steps: parseInt(steps) || 0,
      sleepHours: parseFloat(sleepHours) || 0,
      waterIntake: parseInt(waterIntake) || 0,
      mood: mood,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      notes: notes,
      contextFlags: selectedContexts
    };
    
    const success = await saveHealthData(healthData);
    
    setIsSaving(false);
    
    if (success) {
      // Clear form after successful save
      setSteps('');
      setSleepHours('');
      setWaterIntake('');
      setMood(3);
      setNotes('');
      setSelectedContexts([]);
      
      if (onSaveComplete) {
        onSaveComplete(healthData);
      }
    }
  };

  const renderMoodButton = (value, icon, label) => {
    const isSelected = mood === value;
    return (
      <TouchableOpacity
        style={[
          styles.moodButton,
          isSelected && styles.selectedMoodButton,
          { backgroundColor: isSelected ? getMoodColor(value) : theme.colors.card }
        ]}
        onPress={() => setMood(value)}
        activeOpacity={0.7}
      >
        <Text style={styles.moodEmoji}>{icon}</Text>
        <Text style={[
          styles.moodLabel,
          isSelected && styles.selectedMoodLabel
        ]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const getMoodColor = (value) => {
    switch(value) {
      case 1: return '#FF5252';
      case 2: return '#FF9800';
      case 3: return '#FFC107';
      case 4: return '#8BC34A';
      case 5: return '#4CAF50';
      default: return theme.colors.primary;
    }
  };

  const toggleContext = (contextId) => {
    if (selectedContexts.includes(contextId)) {
      setSelectedContexts(selectedContexts.filter(id => id !== contextId));
    } else {
      setSelectedContexts([...selectedContexts, contextId]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Today's Health Data</Text>
        
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Ionicons name="footsteps-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.label}>Steps</Text>
            </View>
            <TextInput
              style={styles.input}
              value={steps}
              onChangeText={setSteps}
              placeholder="How many steps did you take?"
              keyboardType="number-pad"
              placeholderTextColor={theme.colors.text.hint}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Ionicons name="moon-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.label}>Sleep Hours</Text>
            </View>
            <TextInput
              style={styles.input}
              value={sleepHours}
              onChangeText={setSleepHours}
              placeholder="How many hours did you sleep?"
              keyboardType="decimal-pad"
              placeholderTextColor={theme.colors.text.hint}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Ionicons name="water-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.label}>Water Intake</Text>
            </View>
            <TextInput
              style={styles.input}
              value={waterIntake}
              onChangeText={setWaterIntake}
              placeholder="How many glasses of water did you drink?"
              keyboardType="number-pad"
              placeholderTextColor={theme.colors.text.hint}
            />
          </View>
        </View>
        
        <View style={styles.moodCard}>
          <Text style={styles.moodTitle}>How are you feeling today?</Text>
          
          <View style={styles.moodContainer}>
            {renderMoodButton(1, '😔', 'Poor')}
            {renderMoodButton(2, '😕', 'Fair')}
            {renderMoodButton(3, '😐', 'Okay')}
            {renderMoodButton(4, '🙂', 'Good')}
            {renderMoodButton(5, '😃', 'Great')}
          </View>
        </View>
        
        {/* Context Annotations - NEW SECTION */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Context Flags (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Add context to better understand your data
          </Text>
          
          <View style={styles.contextContainer}>
            {contextOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.contextBadge,
                  selectedContexts.includes(option.id) && styles.selectedContextBadge
                ]}
                onPress={() => toggleContext(option.id)}
              >
                <Ionicons 
                  name={option.icon} 
                  size={20} 
                  color={selectedContexts.includes(option.id) ? 'white' : theme.colors.text.secondary} 
                />
                <Text 
                  style={[
                    styles.contextLabel,
                    selectedContexts.includes(option.id) && styles.selectedContextLabel
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.label}>Notes</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional context about today's data"
              multiline
              numberOfLines={3}
              placeholderTextColor={theme.colors.text.hint}
              textAlignVertical="top"
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="white" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Save Health Data</Text>
            </>
          )}
        </TouchableOpacity>
        
        <View style={styles.privacyNote}>
          <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.text.hint} />
          <Text style={styles.privacyText}>
            Your data is stored locally on your device only.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  formContainer: {
    padding: theme.spacing.m,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.m,
    marginTop: theme.spacing.s,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.small,
  },
  inputGroup: {
    marginVertical: theme.spacing.s,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  label: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeights.medium,
    marginLeft: theme.spacing.s,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.s,
    paddingHorizontal: theme.spacing.m,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.m,
  },
  moodCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.small,
  },
  moodTitle: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.s,
  },
  moodButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.s,
    borderRadius: theme.borderRadius.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '18%',
  },
  selectedMoodButton: {
    borderWidth: 0,
    ...theme.shadows.small,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: theme.spacing.s,
  },
  moodLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
  },
  selectedMoodLabel: {
    color: theme.colors.text.light,
    fontWeight: theme.typography.fontWeights.medium,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.secondary,
    marginBottom: 16,
  },
  contextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  contextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedContextBadge: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  contextLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: 6,
  },
  selectedContextLabel: {
    color: 'white',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginTop: theme.spacing.m,
    ...theme.shadows.medium,
  },
  saveIcon: {
    marginRight: theme.spacing.s,
  },
  saveButtonText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  privacyText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text.hint,
    marginLeft: theme.spacing.xs,
  },
});

export default DataEntryForm;