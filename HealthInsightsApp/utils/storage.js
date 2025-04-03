import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storing different types of health data
const HEALTH_DATA_KEY = '@health_insights_app_data';

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