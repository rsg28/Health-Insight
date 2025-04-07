/**
 * Simple standalone script to test Ollama API connection
 * Run with: node debug-connection.js
 */

const axios = require('axios');

// Use the same URL that your app uses
const API_URL = 'http://209.87.57.234:8080';

// This function makes a GET request to the root endpoint
async function testRootEndpoint() {
  console.log(`Testing connection to root endpoint: ${API_URL}`);
  try {
    const response = await axios.get(API_URL, {
      timeout: 10000
    });
    console.log('✅ Root connection successful!');
    console.log(`Status: ${response.status}`);
    console.log(`Data received: ${response.data ? 'Yes' : 'No'}`);
    if (response.data) {
      console.log(`First 100 chars: ${JSON.stringify(response.data).substring(0, 100)}`);
    }
    return true;
  } catch (error) {
    console.log('❌ Root connection failed!');
    console.log(`Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Data: ${JSON.stringify(error.response.data).substring(0, 100)}`);
    }
    console.log(`Full error: ${JSON.stringify(error).substring(0, 200)}`);
    return false;
  }
}

// This function makes a POST request to the API endpoint
async function testApiEndpoint() {
  console.log(`\nTesting connection to API endpoint: ${API_URL}/api/generate`);
  try {
    const response = await axios.post(`${API_URL}/api/generate`, {
      model: 'llama3',
      prompt: 'Say "Hello from debug test"',
      stream: false,
      options: {
        temperature: 0.7,
        max_tokens: 30
      }
    }, {
      timeout: 15000
    });
    
    console.log('✅ API request successful!');
    console.log(`Status: ${response.status}`);
    console.log(`Response format valid: ${response.data && response.data.response ? 'Yes' : 'No'}`);
    if (response.data && response.data.response) {
      console.log(`Model said: "${response.data.response.trim()}"`);
    } else {
      console.log(`Data received: ${JSON.stringify(response.data).substring(0, 100)}`);
    }
    return true;
  } catch (error) {
    console.log('❌ API request failed!');
    console.log(`Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Data: ${JSON.stringify(error.response.data).substring(0, 100)}`);
    }
    console.log(`Full error: ${JSON.stringify(error).substring(0, 200)}`);
    return false;
  }
}

// Function to test CORS issues
async function testCorsSettings() {
  console.log('\nTesting for potential CORS issues...');
  try {
    const response = await axios.options(API_URL, {
      headers: {
        'Origin': 'http://localhost:19000', // Expo development server 
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Origin, Content-Type'
      }
    });
    
    console.log('CORS preflight response received:');
    console.log(`Status: ${response.status}`);
    console.log('Headers:');
    console.log(` - Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin'] || 'Not set'}`);
    console.log(` - Access-Control-Allow-Methods: ${response.headers['access-control-allow-methods'] || 'Not set'}`);
    console.log(` - Access-Control-Allow-Headers: ${response.headers['access-control-allow-headers'] || 'Not set'}`);
    
    if (!response.headers['access-control-allow-origin']) {
      console.log('⚠️ No CORS headers found! This could be causing your app issues.');
    } else {
      console.log('✅ CORS headers look good!');
    }
  } catch (error) {
    console.log('❌ CORS test failed!');
    console.log(`Error: ${error.message}`);
    console.log('⚠️ This may indicate a CORS issue with your server setup.');
  }
}

// Run all tests
async function runTests() {
  console.log('=== OLLAMA API CONNECTION DIAGNOSTIC ===');
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log(`Testing URL: ${API_URL}`);
  console.log('======================================\n');
  
  // Test basic connection
  const rootOk = await testRootEndpoint();
  
  // Test API
  const apiOk = await testApiEndpoint();
  
  // Test CORS
  await testCorsSettings();
  
  // Summary
  console.log('\n=== SUMMARY ===');
  console.log(`Root connection: ${rootOk ? '✅ OK' : '❌ Failed'}`);
  console.log(`API connection: ${apiOk ? '✅ OK' : '❌ Failed'}`);
  console.log('\nPossible issues:');
  
  if (!rootOk && !apiOk) {
    console.log('1. Your phone and computer might not be on the same network');
    console.log('2. The Docker container might not be running');
    console.log('3. Your firewall might be blocking connections to port 8080');
    console.log('4. The IP address might have changed - current: ' + API_URL);
  } else if (rootOk && !apiOk) {
    console.log('1. The proxy is running but not properly forwarding API requests');
    console.log('2. Ollama server might not be running on your computer');
    console.log('3. The model "llama3" might not be available - check with: ollama list');
  } else if (!rootOk && apiOk) {
    console.log('This is an unexpected state! Root fails but API works?');
  } else {
    console.log('Both tests passed! The issue might be in the app itself:');
    console.log('1. Check if the app is using a different URL than this test');
    console.log('2. There might be CORS issues if your app is a web app');
    console.log('3. There might be network permission issues in your app');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Fatal error running tests:', error);
}); 