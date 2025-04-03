import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import DataEntryForm from '../components/DataEntryForm';

const DataEntryScreen = ({ navigation }) => {
  // Handle completion of form submission
  const handleSaveComplete = (data) => {
    // Show success message
    Alert.alert(
      "Data Saved",
      "Your health data has been saved successfully.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <DataEntryForm onSaveComplete={handleSaveComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default DataEntryScreen;