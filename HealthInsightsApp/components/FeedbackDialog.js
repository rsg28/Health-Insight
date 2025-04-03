import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../utils/theme';

const FeedbackDialog = ({ visible, onClose, onSubmit, insightType }) => {
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
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Was this insight helpful?</Text>
          
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity 
                key={value}
                onPress={() => setRating(value)}
                style={[
                  styles.ratingButton,
                  rating === value && styles.selectedRating
                ]}
              >
                <Text style={rating === value ? styles.selectedRatingText : styles.ratingText}>
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.inputLabel}>Additional Comments (Optional)</Text>
          <TextInput
            style={styles.input}
            value={comment}
            onChangeText={setComment}
            placeholder="Tell us more about your experience..."
            multiline
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
    backgroundColor: 'white',
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
    color: theme.colors.text.primary,
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
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRating: {
    backgroundColor: theme.colors.primary,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  selectedRatingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  inputLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: theme.colors.text.primary,
    backgroundColor: '#f9f9f9',
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
    borderColor: theme.colors.border,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    marginLeft: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default FeedbackDialog;