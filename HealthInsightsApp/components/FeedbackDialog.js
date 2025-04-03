import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';

const FeedbackDialog = ({ visible, onClose, onSubmit, insightType }) => {
  const { theme } = useTheme();
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit({ rating, comment, insightType, timestamp: new Date().toISOString() });
    setRating(3);
    setComment('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>
            Was this insight helpful?
          </Text>
          
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity 
                key={value}
                onPress={() => setRating(value)}
                style={[
                  styles.ratingButton,
                  { backgroundColor: theme.colors.background },
                  rating === value && [styles.selectedRating, { backgroundColor: theme.colors.primary }]
                ]}
              >
                <Text style={[
                  styles.ratingText, 
                  { color: theme.colors.text.secondary },
                  rating === value && styles.selectedRatingText
                ]}>
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={[styles.inputLabel, { color: theme.colors.text.secondary }]}>
            Additional Comments (Optional)
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background,
                color: theme.colors.text.primary
              }
            ]}
            value={comment}
            onChangeText={setComment}
            placeholder="Tell us more about your experience..."
            placeholderTextColor={theme.colors.text.hint}
            multiline
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.cancelButton, 
                { borderColor: theme.colors.border }
              ]} 
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.text.secondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: theme.colors.primary }]} 
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ratingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRating: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedRatingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default FeedbackDialog;