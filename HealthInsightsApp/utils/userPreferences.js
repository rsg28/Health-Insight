import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PREFERENCES_KEY = '@health_insights_app_preferences';

// Structure for default preferences
const DEFAULT_PREFERENCES = {
  metrics: {
    steps: {
      goal: 10000,
      minThreshold: 5000,
      maxThreshold: 15000
    },
    sleepHours: {
      goal: 8,
      minThreshold: 6,
      maxThreshold: 9
    },
    waterIntake: {
      goal: 8,
      minThreshold: 4,
      maxThreshold: 12
    },
    mood: {
      goal: 4,
      minThreshold: 3,
      maxThreshold: 5
    }
  },
  notifications: {
    enabled: false,
    reminderTime: '20:00'
  },
  privacy: {
    dataRetentionDays: 365,
    shareAnonymousData: false
  }
};

export const getUserPreferences = async () => {
  try {
    const prefJSON = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
    return prefJSON ? JSON.parse(prefJSON) : DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};

export const saveUserPreferences = async (preferences) => {
  try {
    await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
};

export const updateMetricPreferences = async (metric, values) => {
  try {
    const prefs = await getUserPreferences();
    prefs.metrics[metric] = {
      ...prefs.metrics[metric],
      ...values
    };
    return await saveUserPreferences(prefs);
  } catch (error) {
    console.error('Error updating metric preferences:', error);
    return false;
  }
};

export const saveUserFeedback = async (feedback) => {
  try {
    const FEEDBACK_KEY = '@health_insights_app_feedback';
    
    // Get existing feedback
    const existingFeedbackJSON = await AsyncStorage.getItem(FEEDBACK_KEY);
    const existingFeedback = existingFeedbackJSON ? JSON.parse(existingFeedbackJSON) : [];
    
    // Add new feedback
    existingFeedback.push({
      ...feedback,
      id: Date.now().toString()
    });
    
    // Save updated feedback
    await AsyncStorage.setItem(FEEDBACK_KEY, JSON.stringify(existingFeedback));
    return true;
  } catch (error) {
    console.error('Error saving user feedback:', error);
    return false;
  }
};

export const getPrivacySettings = async () => {
  try {
    const prefs = await getUserPreferences();
    return prefs.privacy;
  } catch (error) {
    console.error('Error getting privacy settings:', error);
    return DEFAULT_PREFERENCES.privacy;
  }
};

export const updatePrivacySettings = async (privacySettings) => {
  try {
    const prefs = await getUserPreferences();
    prefs.privacy = {
      ...prefs.privacy,
      ...privacySettings
    };
    return await saveUserPreferences(prefs);
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    return false;
  }
};