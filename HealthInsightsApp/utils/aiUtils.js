import axios from 'axios';
import OLLAMA_API_HOST from '../config/apiConfig';

/**
 * Check if the AI model service is available
 * @param {string} modelName - The name of the model to check
 * @param {string} baseUrl - The base URL of the AI service
 * @returns {Promise<boolean>} - True if the service is available, false otherwise
 */
export const checkAIServiceAvailability = async (modelName = 'llama3', baseUrl = OLLAMA_API_HOST) => {
  try {
    // Try to get the list of models from the API
    const response = await axios.get(`${baseUrl}`);
    
    // Check if the server is accessible
    if (response.status !== 200) {
      console.log('AI service returned non-200 status:', response.status);
      return false;
    }
    
    // If we can access the server, let's try a direct test
    const testResult = await testAIService(modelName, baseUrl);
    return testResult.success;
  } catch (error) {
    console.error('Error checking AI service availability:', error.message);
    return false;
  }
};

/**
 * Test the AI service with a simple prompt
 * @param {string} modelName - The name of the model to use
 * @param {string} baseUrl - The base URL of the AI service
 * @returns {Promise<Object>} - Result object with success and response props
 */
export const testAIService = async (modelName = 'llama3', baseUrl = OLLAMA_API_HOST) => {
  try {
    const response = await axios.post(`${baseUrl}/api/generate`, {
      model: modelName,
      prompt: 'Say "Hello, I am a health advisor powered by Llama3"',
      stream: false,
      options: {
        temperature: 0.7,
        max_tokens: 30
      }
    }, {
      timeout: 10000 // 10 second timeout
    });
    
    if (response.data && response.data.response) {
      return {
        success: true,
        response: response.data.response
      };
    } else {
      return {
        success: false,
        error: 'Invalid response from AI model'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}; 