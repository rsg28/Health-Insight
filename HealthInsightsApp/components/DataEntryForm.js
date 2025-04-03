import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { saveHealthData } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

const DataEntryForm = ({ onSaveComplete }) => {
  const [steps, setSteps] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [mood, setMood] = useState(3); // Default to middle value
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    const healthData = {
      steps: parseInt(steps) || 0,
      sleepHours: parseFloat(sleepHours) || 0,
      waterIntake: parseInt(waterIntake) || 0,
      mood: mood,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    };
    
    const success = await saveHealthData(healthData);
    
    setIsSaving(false);
    
    if (success) {
      // Clear form after successful save
      setSteps('');
      setSleepHours('');
      setWaterIntake('');
      setMood(3);
      
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
          isSelected && styles.selectedMoodButton
        ]}
        onPress={() => setMood(value)}
      >
        <Text style={styles.moodEmoji}>{icon}</Text>
        <Text style={[
          styles.moodLabel,
          isSelected && styles.selectedMoodLabel
        ]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Enter Today's Health Data</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Steps</Text>
        <TextInput
          style={styles.input}
          value={steps}
          onChangeText={setSteps}
          placeholder="How many steps did you take?"
          keyboardType="number-pad"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sleep Hours</Text>
        <TextInput
          style={styles.input}
          value={sleepHours}
          onChangeText={setSleepHours}
          placeholder="How many hours did you sleep?"
          keyboardType="decimal-pad"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Water Intake (glasses)</Text>
        <TextInput
          style={styles.input}
          value={waterIntake}
          onChangeText={setWaterIntake}
          placeholder="How many glasses of water did you drink?"
          keyboardType="number-pad"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mood</Text>
        <View style={styles.moodContainer}>
          {renderMoodButton(1, '😔', 'Poor')}
          {renderMoodButton(2, '😕', 'Fair')}
          {renderMoodButton(3, '😐', 'Okay')}
          {renderMoodButton(4, '🙂', 'Good')}
          {renderMoodButton(5, '😃', 'Great')}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? 'Saving...' : 'Save Health Data'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  moodButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    width: '18%',
  },
  selectedMoodButton: {
    backgroundColor: '#6200ee',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: '#555',
  },
  selectedMoodLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DataEntryForm;