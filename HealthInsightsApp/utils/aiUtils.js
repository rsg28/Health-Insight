import axios from 'axios';
import OLLAMA_API_HOST from '../config/apiConfig';

// Add detailed logging of the configuration 
console.log('Ollama API Host configured as:', OLLAMA_API_HOST);

/**
 * Check if the AI model service is available
 * @param {string} modelName - The name of the model to check
 * @param {string} baseUrl - The base URL of the AI service
 * @returns {Promise<boolean>} - True if the service is available, false otherwise
 */
export const checkAIServiceAvailability = async (modelName = 'llama3', baseUrl = OLLAMA_API_HOST) => {
  try {
    console.log(`Checking AI service at ${baseUrl}...`);
    
    // Try to get the list of models from the API
    const response = await axios.get(`${baseUrl}`);
    
    console.log('Root endpoint response:', response.status, response.data ? 'Has data' : 'No data');
    
    // Check if the server is accessible
    if (response.status !== 200) {
      console.log('AI service returned non-200 status:', response.status);
      return false;
    }
    
    // If we can access the server, let's try a direct test
    const testResult = await testAIService(modelName, baseUrl);
    console.log('Model test result:', testResult);
    return testResult.success;
  } catch (error) {
    console.error('Error checking AI service availability:', error.message);
    console.error('Full error details:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
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
    console.log(`Testing model generation at ${baseUrl}/api/generate`);
    console.log(`Using model: ${modelName}`);
    
    const response = await axios.post(`${baseUrl}/api/generate`, {
      model: modelName,
      prompt: 'Say "Hello, I am a health advisor powered by Llama3"',
      stream: false,
      options: {
        temperature: 0.7,
        max_tokens: 30
      }
    }, {
      timeout: 15000 // Increased timeout to 15 seconds
    });
    
    console.log('API response received, status:', response.status);
    
    if (response.data && response.data.response) {
      console.log('Model response:', response.data.response.substring(0, 50) + '...');
      return {
        success: true,
        response: response.data.response
      };
    } else {
      console.log('Invalid response format:', JSON.stringify(response.data).substring(0, 100));
      return {
        success: false,
        error: 'Invalid response from AI model'
      };
    }
  } catch (error) {
    console.error('Error testing AI model:', error.message);
    console.error('Full error details:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}; 