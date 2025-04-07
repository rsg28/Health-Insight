const axios = require('axios');

/**
 * Check if the AI model service is available
 * @param {string} modelName - The name of the model to check
 * @param {string} baseUrl - The base URL of the AI service
 * @returns {Promise<boolean>} - True if the service is available, false otherwise
 */
const checkAIServiceAvailability = async (modelName = 'llama3', baseUrl = 'http://localhost:11434') => {
  try {
    console.log(`Attempting to connect to Ollama at ${baseUrl}...`);
    
    // First try a simpler request to check if the server is responding at all
    try {
      const rootResponse = await axios.get(baseUrl);
      console.log('Server root endpoint response:', rootResponse.status);
      console.log('Ollama server is running!');
      
      // Try a direct model query instead of checking list of models
      console.log(`Testing model availability by sending a simple prompt to ${modelName}...`);
      const testResult = await testAIService(modelName, baseUrl);
      
      if (testResult.success) {
        console.log(`✅ Model ${modelName} is responding!`);
        return true;
      } else {
        console.log(`❌ Model ${modelName} failed to respond: ${testResult.error}`);
        console.log(`You may need to pull the model with: ollama pull ${modelName}`);
        return false;
      }
    } catch (rootErr) {
      console.log('Server root endpoint error:', rootErr.message);
      // Try the direct model test anyway
      const testResult = await testAIService(modelName, baseUrl);
      if (testResult.success) {
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error('Error checking AI service availability:', error.message);
    
    // Add specific troubleshooting advice based on error
    if (error.code === 'ECONNREFUSED') {
      console.log('\nTROUBLESHOOTING:');
      console.log('1. Confirm Ollama is running with: ollama ps');
      console.log('2. Check if Ollama is listening on port 11434');
      console.log('3. Make sure there are no firewall issues blocking connections');
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
const testAIService = async (modelName = 'llama3', baseUrl = 'http://localhost:11434') => {
  try {
    console.log(`Sending test prompt to ${baseUrl}/api/generate...`);
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
    console.log('Test prompt error:', error.message);
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    }
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
};

/**
 * Test script to check the connection to the Llama3 AI service
 */
const testConnection = async () => {
  console.log('Testing connection to Llama3 AI service...');
  
  // Check if the service is available
  const isAvailable = await checkAIServiceAvailability();
  
  if (isAvailable) {
    console.log('✅ AI service is available and responding!');
    console.log('You can now use the AI Advisor component in the app.');
  } else {
    console.log('❌ AI service is not available or not responding correctly.');
    console.log('Please make sure Llama3 is running on http://localhost:11434/');
    console.log('You can start it with: ollama run llama3');
  }
};

// Run the test
testConnection().catch(error => {
  console.error('Test failed with error:', error);
}); 