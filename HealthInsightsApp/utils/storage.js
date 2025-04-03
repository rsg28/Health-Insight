import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storing different types of health data
const HEALTH_DATA_KEY = '@health_insights_app_data';
const FEEDBACK_KEY = '@health_insights_app_feedback';

// Save health data to local storage
export const saveHealthData = async (newEntry) => {
  try {
    // Get existing data
    const existingDataJSON = await AsyncStorage.getItem(HEALTH_DATA_KEY);
    let existingData = existingDataJSON ? JSON.parse(existingDataJSON) : [];
    
    // Add new entry to the data array
    existingData.push({
      ...newEntry,
      id: Date.now().toString(), // Simple unique ID
      timestamp: new Date().toISOString()
    });
    
    // Save updated data back to storage
    await AsyncStorage.setItem(HEALTH_DATA_KEY, JSON.stringify(existingData));
    return true;
  } catch (error) {
    console.error('Error saving health data:', error);
    return false;
  }
};

// Get all health data from storage
export const getAllHealthData = async () => {
  try {
    const dataJSON = await AsyncStorage.getItem(HEALTH_DATA_KEY);
    return dataJSON ? JSON.parse(dataJSON) : [];
  } catch (error) {
    console.error('Error retrieving health data:', error);
    return [];
  }
};

// Get health data for a specific date range
export const getHealthDataByDateRange = async (startDate, endDate) => {
  try {
    const allData = await getAllHealthData();
    
    // Filter data by date range
    return allData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });
  } catch (error) {
    console.error('Error retrieving health data by date range:', error);
    return [];
  }
};

// Delete health data for a specific date range
export const deleteHealthDataByDateRange = async (startDate, endDate) => {
  try {
    const allData = await getAllHealthData();
    
    // Filter out data that falls within the specified date range
    const filteredData = allData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return !(itemDate >= startDate && itemDate <= endDate);
    });
    
    // Save the filtered data back to storage
    await AsyncStorage.setItem(HEALTH_DATA_KEY, JSON.stringify(filteredData));
    return true;
  } catch (error) {
    console.error('Error deleting health data by date range:', error);
    return false;
  }
};

// Delete specific metric from all health data entries
export const deleteHealthDataByMetric = async (metric) => {
  try {
    const allData = await getAllHealthData();
    
    // Update all entries by removing the specified metric
    const updatedData = allData.map(item => {
      const updatedItem = { ...item };
      if (updatedItem.hasOwnProperty(metric)) {
        delete updatedItem[metric];
      }
      return updatedItem;
    });
    
    // Save the updated data back to storage
    await AsyncStorage.setItem(HEALTH_DATA_KEY, JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error('Error deleting health data by metric:', error);
    return false;
  }
};

// Clear all health data (for privacy/reset)
export const clearAllHealthData = async () => {
  try {
    await AsyncStorage.removeItem(HEALTH_DATA_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing health data:', error);
    return false;
  }
};

// Export health data as JSON string (for sharing/export)
export const exportHealthDataAsJSON = async () => {
  try {
    const allData = await getAllHealthData();
    return JSON.stringify(allData, null, 2); // Pretty printed JSON
  } catch (error) {
    console.error('Error exporting health data:', error);
    return null;
  }
};

// Export health data as CSV string
export const exportHealthDataAsCSV = async () => {
  try {
    const allData = await getAllHealthData();
    
    if (allData.length === 0) {
      return '';
    }
    
    // Extract headers from first data entry
    const headers = Object.keys(allData[0]).filter(key => 
      key !== 'id' // Exclude id from CSV
    );
    
    // Create CSV header row
    let csv = headers.join(',') + '\n';
    
    // Add data rows
    allData.forEach(entry => {
      const row = headers.map(header => {
        // Handle special formatting or quotes if needed
        return `"${entry[header]}"`;
      }).join(',');
      
      csv += row + '\n';
    });
    
    return csv;
  } catch (error) {
    console.error('Error exporting health data as CSV:', error);
    return null;
  }
};

// Save user feedback
export const saveUserFeedback = async (feedback) => {
  try {
    // Get existing feedback
    const existingFeedbackJSON = await AsyncStorage.getItem(FEEDBACK_KEY);
    const existingFeedback = existingFeedbackJSON ? JSON.parse(existingFeedbackJSON) : [];
    
    // Add new feedback
    existingFeedback.push({
      ...feedback,
      id: Date.now().toString(), // Simple unique ID
      timestamp: new Date().toISOString()
    });
    
    // Save updated feedback
    await AsyncStorage.setItem(FEEDBACK_KEY, JSON.stringify(existingFeedback));
    return true;
  } catch (error) {
    console.error('Error saving user feedback:', error);
    return false;
  }
};

// Get all user feedback from storage
export const getAllUserFeedback = async () => {
  try {
    const feedbackJSON = await AsyncStorage.getItem(FEEDBACK_KEY);
    return feedbackJSON ? JSON.parse(feedbackJSON) : [];
  } catch (error) {
    console.error('Error retrieving user feedback:', error);
    return [];
  }
};

// Export data with provenance metadata
export const exportHealthDataWithProvenance = async () => {
  try {
    const allData = await getAllHealthData();
    
    // Add provenance metadata
    const dataWithProvenance = {
      data: allData,
      provenance: {
        source: "Health Insights App",
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        dataCollectionMethod: "User self-reported data",
        dataPointCount: allData.length,
        metrics: {
          steps: "User-entered step count",
          sleepHours: "User-entered sleep duration in hours",
          waterIntake: "User-entered water intake in glasses",
          mood: "User-entered mood on 1-5 scale"
        }
      }
    };
    
    return JSON.stringify(dataWithProvenance, null, 2); // Pretty printed JSON
  } catch (error) {
    console.error('Error exporting health data with provenance:', error);
    return null;
  }
};