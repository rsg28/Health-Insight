import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useTheme } from '../utils/ThemeContext';
import { checkAIServiceAvailability, testAIService } from '../utils/aiUtils';

const AIAdvisorBox = ({ userHealthData, selectedMetric, onError }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState(null);
  const [serviceAvailable, setServiceAvailable] = useState(false);

  // Check if the AI service is available when the component mounts
  useEffect(() => {
    const checkService = async () => {
      const isAvailable = await checkAIServiceAvailability('llama3');
      setServiceAvailable(isAvailable);
      
      if (!isAvailable) {
        setError('AI service not available. Make sure Llama3 is running on localhost:11434.');
        if (onError) onError(new Error('AI service not available'));
      } else {
        // Test the service
        const test = await testAIService('llama3');
        if (!test.success) {
          setError(`AI service available but not responding correctly: ${test.error}`);
          if (onError) onError(new Error(test.error));
        }
      }
    };
    
    checkService();
  }, []);

  // Generate a system prompt based on user data when the component mounts or metric changes
  useEffect(() => {
    if (userHealthData && userHealthData.length > 0 && serviceAvailable && !error) {
      generateDefaultInsight();
    }
  }, [userHealthData, selectedMetric, serviceAvailable]);

  const generateDefaultInsight = async () => {
    if (!userHealthData || userHealthData.length === 0) {
      setResponse("Add more health data to receive AI-powered insights.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Create a summary of the user's health data
      const recentData = userHealthData.slice(-7); // Last 7 entries
      
      let metricName = selectedMetric;
      let metricContext = '';
      
      switch(selectedMetric) {
        case 'steps': 
          metricName = 'steps'; 
          metricContext = 'Ideal daily step count is often cited as 10,000 steps, but benefits begin at lower levels.';
          break;
        case 'sleepHours': 
          metricName = 'sleep hours'; 
          metricContext = 'Adults generally need 7-9 hours of sleep per night for optimal health.';
          break;
        case 'waterIntake': 
          metricName = 'glasses of water'; 
          metricContext = 'A common recommendation is 8 glasses (8oz each) of water daily, though needs vary by individual.';
          break;
        case 'mood': 
          metricName = 'mood (1-5 scale)'; 
          metricContext = 'On this scale, 1 is very negative mood and 5 is very positive mood.';
          break;
        default: 
          metricName = selectedMetric;
      }
      
      const averageValue = recentData.reduce((sum, entry) => 
        sum + (entry[selectedMetric] || 0), 0) / recentData.length;
      
      // Get trend information  
      const isIncreasing = recentData.length > 1 && 
        recentData[recentData.length-1][selectedMetric] > recentData[0][selectedMetric];
      const isDecreasing = recentData.length > 1 && 
        recentData[recentData.length-1][selectedMetric] < recentData[0][selectedMetric];
      
      const trendInfo = recentData.length > 1 
        ? `Their ${metricName} appears to be ${isIncreasing ? 'increasing' : isDecreasing ? 'decreasing' : 'stable'} over the last week.`
        : '';
        
      const systemPrompt = `You are a knowledgeable health advisor. Based on the user's recent health data, 
        provide a brief, helpful insight about their ${metricName}. 
        Their average ${metricName} over the last week is ${averageValue.toFixed(1)}.
        ${trendInfo}
        ${metricContext}
        
        Keep your response under 150 words and focus on actionable, evidence-based advice.
        Format your response in a friendly, conversational tone.
        Do not include numerical recommendations unless they are well-established in medical literature.`;
        
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3',
        prompt: systemPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: 300
        }
      });
      
      if (response.data && response.data.response) {
        setResponse(response.data.response.trim());
      } else {
        throw new Error('Invalid response from AI model');
      }
    } catch (err) {
      console.error('Error generating AI insight:', err);
      setError('Could not connect to AI advisor. Please check if the service is running.');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create a context with user's health data
      const recentData = userHealthData.slice(-7); // Last 7 entries
      
      let metricName = selectedMetric;
      let metricContext = '';
      
      switch(selectedMetric) {
        case 'steps': 
          metricName = 'steps'; 
          metricContext = 'Ideal daily step count is often cited as 10,000 steps, but benefits begin at lower levels.';
          break;
        case 'sleepHours': 
          metricName = 'sleep hours'; 
          metricContext = 'Adults generally need 7-9 hours of sleep per night for optimal health.';
          break;
        case 'waterIntake': 
          metricName = 'glasses of water'; 
          metricContext = 'A common recommendation is 8 glasses (8oz each) of water daily, though needs vary by individual.';
          break;
        case 'mood': 
          metricName = 'mood (1-5 scale)'; 
          metricContext = 'On this scale, 1 is very negative mood and 5 is very positive mood.';
          break;
        default: 
          metricName = selectedMetric;
      }
      
      const averageValue = recentData.reduce((sum, entry) => 
        sum + (entry[selectedMetric] || 0), 0) / recentData.length;
      
      const systemPrompt = `You are a knowledgeable health advisor. The user is tracking their ${metricName}.
        Their average ${metricName} over the last week is ${averageValue.toFixed(1)}.
        ${metricContext}
        
        The user's question is: "${prompt}"
        
        If their question relates to health advice, provide a helpful, evidence-based response.
        Keep your answer concise, factual and under 200 words.
        Format your response in a friendly, conversational tone.
        
        If their question is not related to health, politely state that you can only advise on health matters.`;
        
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3',
        prompt: systemPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: 400
        }
      });
      
      if (response.data && response.data.response) {
        setResponse(response.data.response.trim());
        setPrompt('');
        setShowInput(false);
      } else {
        throw new Error('Invalid response from AI model');
      }
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError('Could not connect to AI advisor. Please check if the service is running.');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  const checkAndReconnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const isAvailable = await checkAIServiceAvailability('llama3');
      setServiceAvailable(isAvailable);
      
      if (!isAvailable) {
        setError('AI service not available. Make sure Llama3 is running on localhost:11434.');
        if (onError) onError(new Error('AI service not available'));
      } else {
        // If service is available, generate insights
        await generateDefaultInsight();
      }
    } catch (err) {
      console.error('Error checking AI service:', err);
      setError('Could not connect to AI advisor. Please check if the service is running.');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="medical-outline" size={22} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>AI Health Advisor</Text>
        </View>
        <Text style={[styles.subtitle, { color: error ? theme.colors.error : serviceAvailable ? theme.colors.success : theme.colors.text.secondary }]}>
          {error ? 'Connection error' : serviceAvailable ? 'Connected to Llama3' : 'Checking connection...'}
        </Text>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
              Generating health insights...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={24} color={theme.colors.error} />
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
              onPress={checkAndReconnect}
            >
              <Text style={styles.retryButtonText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={[styles.responseText, { color: theme.colors.text.primary }]}>
            {response || "Loading your personalized health insights..."}
          </Text>
        )}
      </View>
      
      {showInput ? (
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputContainer}
        >
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.background,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }]}
            placeholder="Ask a health question..."
            placeholderTextColor={theme.colors.text.hint}
            value={prompt}
            onChangeText={setPrompt}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleAskQuestion}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleAskQuestion}
            disabled={loading || !prompt.trim()}
          >
            <Ionicons name="send-outline" size={20} color="white" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primaryLight }]}
            onPress={() => setShowInput(true)}
          >
            <Ionicons name="chatbubble-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
              Ask a Question
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.background }]}
            onPress={generateDefaultInsight}
            disabled={loading}
          >
            <Ionicons name="refresh-outline" size={18} color={theme.colors.text.secondary} />
            <Text style={[styles.buttonText, { color: theme.colors.text.secondary }]}>
              Refresh Insight
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 30,
  },
  content: {
    padding: 16,
    minHeight: 120,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 8,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  responseText: {
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    marginLeft: 6,
    fontWeight: '500',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default AIAdvisorBox; 