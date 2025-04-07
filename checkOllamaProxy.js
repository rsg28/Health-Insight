const axios = require('axios');

// Configuration
const LOCALHOST_URL = 'http://localhost:8080';
const NETWORK_IP = '209.87.57.234';
const NETWORK_URL = `http://${NETWORK_IP}:8080`;
const ORIGINAL_OLLAMA_URL = 'http://localhost:11434';

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function testEndpoint(url, description) {
  console.log(`\n${colors.cyan}Testing ${description} (${url})${colors.reset}`);
  
  try {
    const response = await axios.get(url, { timeout: 5000 });
    console.log(`${colors.green}✓ Connection successful${colors.reset}`);
    console.log(`  Status: ${response.status}`);
    console.log(`  Response exists: ${response.data ? 'Yes' : 'No'}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Connection failed${colors.reset}`);
    if (error.code === 'ECONNREFUSED') {
      console.log(`  Error: Connection refused. Service might not be running.`);
    } else if (error.code === 'ETIMEDOUT') {
      console.log(`  Error: Connection timed out. Service might be unreachable.`);
    } else {
      console.log(`  Error: ${error.message}`);
    }
    return false;
  }
}

async function testOllamaModel(url) {
  console.log(`\n${colors.cyan}Testing Ollama model generation at ${url}${colors.reset}`);
  
  try {
    const response = await axios.post(`${url}/api/generate`, {
      model: 'llama3',
      prompt: 'Say "Hello, Docker proxy test successful!"',
      stream: false,
      options: {
        temperature: 0.7,
        max_tokens: 30
      }
    }, {
      timeout: 10000
    });
    
    if (response.data && response.data.response) {
      console.log(`${colors.green}✓ Model generation successful${colors.reset}`);
      console.log(`  Response: "${response.data.response.trim()}"`);
      return true;
    } else {
      console.log(`${colors.red}✗ Model response format incorrect${colors.reset}`);
      console.log(`  Response data: ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Model generation failed${colors.reset}`);
    if (error.response) {
      console.log(`  Status: ${error.response.status}`);
      console.log(`  Data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.log(`  Error: ${error.message}`);
    }
    return false;
  }
}

async function checkDockerProcess() {
  console.log(`\n${colors.cyan}Checking Docker container status${colors.reset}`);
  
  try {
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
      exec('docker ps | findstr ollama-proxy', (error, stdout, stderr) => {
        if (error || stderr) {
          console.log(`${colors.red}✗ Could not check Docker container status${colors.reset}`);
          console.log(`  Error: ${error ? error.message : stderr}`);
          console.log(`  Make sure Docker is running and you have permission to execute commands.`);
          resolve(false);
          return;
        }
        
        if (stdout.includes('ollama-proxy')) {
          console.log(`${colors.green}✓ Ollama proxy container is running${colors.reset}`);
          console.log(`  Container info: ${stdout.trim()}`);
          resolve(true);
        } else {
          console.log(`${colors.red}✗ Ollama proxy container not found${colors.reset}`);
          console.log(`  You may need to start it with: docker-compose up -d`);
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.log(`${colors.red}✗ Error executing Docker command${colors.reset}`);
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

async function runDiagnostics() {
  console.log(`${colors.blue}======= OLLAMA DOCKER PROXY DIAGNOSTICS =======${colors.reset}`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  
  // Step 1: Check if the Docker container is running
  const dockerRunning = await checkDockerProcess();
  
  // Step 2: Test Ollama direct connection (should work if Ollama is running locally)
  const ollamaDirectOk = await testEndpoint(ORIGINAL_OLLAMA_URL, 'direct Ollama connection');
  
  if (!ollamaDirectOk) {
    console.log(`\n${colors.yellow}⚠ Direct Ollama connection failed. Make sure Ollama is running.${colors.reset}`);
    console.log(`  Try running: ollama serve`);
  }
  
  // Step 3: Test local proxy
  const localProxyOk = await testEndpoint(LOCALHOST_URL, 'local proxy');
  
  if (!localProxyOk && dockerRunning) {
    console.log(`\n${colors.yellow}⚠ Local proxy connection failed but Docker container is running.${colors.reset}`);
    console.log(`  This might indicate a configuration issue with the proxy.`);
    console.log(`  Check the Docker logs with: docker logs $(docker ps -q --filter name=ollama-proxy)`);
  }
  
  // Step 4: Test network proxy
  const networkProxyOk = await testEndpoint(NETWORK_URL, 'network proxy');
  
  if (!networkProxyOk && localProxyOk) {
    console.log(`\n${colors.yellow}⚠ Network proxy failed but local proxy works.${colors.reset}`);
    console.log(`  This might indicate a network/firewall issue.`);
    console.log(`  Check if port 8080 is open in your firewall.`);
    console.log(`  Verify your network IP (${NETWORK_IP}) is correct.`);
  }
  
  // Step 5: If proxy is working, test Ollama model through proxy
  let modelTestOk = false;
  if (localProxyOk) {
    modelTestOk = await testOllamaModel(LOCALHOST_URL);
  }
  
  // Summary
  console.log(`\n${colors.blue}======= DIAGNOSTICS SUMMARY =======${colors.reset}`);
  console.log(`Docker container: ${dockerRunning ? colors.green + '✓ Running' : colors.red + '✗ Not running'}${colors.reset}`);
  console.log(`Direct Ollama: ${ollamaDirectOk ? colors.green + '✓ Connected' : colors.red + '✗ Failed'}${colors.reset}`);
  console.log(`Local proxy: ${localProxyOk ? colors.green + '✓ Connected' : colors.red + '✗ Failed'}${colors.reset}`);
  console.log(`Network proxy: ${networkProxyOk ? colors.green + '✓ Connected' : colors.red + '✗ Failed'}${colors.reset}`);
  console.log(`Model test: ${modelTestOk ? colors.green + '✓ Working' : colors.red + '✗ Failed'}${colors.reset}`);
  
  if (dockerRunning && ollamaDirectOk && localProxyOk && networkProxyOk && modelTestOk) {
    console.log(`\n${colors.green}✓ Everything is working correctly!${colors.reset}`);
    console.log(`  Your phone app should be able to connect to Ollama at: ${NETWORK_URL}`);
  } else {
    console.log(`\n${colors.yellow}⚠ There are some issues with your setup.${colors.reset}`);
    console.log(`  Review the diagnostics above to identify and fix the problems.`);
    
    // Provide specific troubleshooting advice based on failure patterns
    if (!dockerRunning) {
      console.log(`\n${colors.cyan}Troubleshooting Docker:${colors.reset}`);
      console.log(`  1. Make sure Docker Desktop is running`);
      console.log(`  2. Start the container: docker-compose up -d`);
      console.log(`  3. Check container logs: docker logs $(docker ps -q --filter name=ollama-proxy)`);
    }
    
    if (!ollamaDirectOk) {
      console.log(`\n${colors.cyan}Troubleshooting Ollama:${colors.reset}`);
      console.log(`  1. Make sure Ollama is installed`);
      console.log(`  2. Start Ollama: ollama serve`);
      console.log(`  3. Verify it's running: curl http://localhost:11434`);
    }
    
    if (dockerRunning && ollamaDirectOk && !localProxyOk) {
      console.log(`\n${colors.cyan}Troubleshooting Proxy Configuration:${colors.reset}`);
      console.log(`  1. Check Docker logs: docker logs $(docker ps -q --filter name=ollama-proxy)`);
      console.log(`  2. Verify nginx.conf is correctly mounted in the container`);
      console.log(`  3. Restart the container: docker-compose down && docker-compose up -d`);
    }
    
    if (localProxyOk && !networkProxyOk) {
      console.log(`\n${colors.cyan}Troubleshooting Network Access:${colors.reset}`);
      console.log(`  1. Check your firewall settings for port 8080`);
      console.log(`  2. Verify the IP address is correct (currently using ${NETWORK_IP})`);
      console.log(`  3. Try accessing from another device on the same network`);
    }
  }
}

// Run the diagnostics
runDiagnostics().catch(error => {
  console.error(`${colors.red}Fatal error running diagnostics:${colors.reset}`, error);
}); 