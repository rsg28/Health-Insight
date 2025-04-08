/**
 * Auto IP Update Script
 * 
 * This script automatically detects your current WiFi IP address
 * and updates the API configuration file with the new IP.
 */

const fs = require('fs');
const { networkInterfaces } = require('os');
const { exec } = require('child_process');
const path = require('path');

// Config file paths
const API_CONFIG_PATH = path.join(__dirname, 'HealthInsightsApp', 'config', 'apiConfig.js');
const DEBUG_CONNECTION_PATH = path.join(__dirname, 'HealthInsightsApp', 'debug-connection.js');
const PROXY_JS_PATH = path.join(__dirname, 'checkOllamaProxy.js');

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Get the current active WiFi IP address 
 */
function getWifiIpAddress() {
  const interfaces = networkInterfaces();
  let wifiIp = null;
  
  // Search for the WiFi interface
  for (const [name, netInterface] of Object.entries(interfaces)) {
    // Look for the WiFi interface
    if (name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('wifi')) {
      // Find the IPv4 address
      for (const iface of netInterface) {
        if (iface.family === 'IPv4' && !iface.internal) {
          wifiIp = iface.address;
          break;
        }
      }
      if (wifiIp) break;
    }
  }
  
  return wifiIp;
}

/**
 * Update the API config file with the new IP address
 */
function updateApiConfigFile(ipAddress) {
  try {
    if (!fs.existsSync(API_CONFIG_PATH)) {
      console.log(`${colors.red}API config file not found: ${API_CONFIG_PATH}${colors.reset}`);
      return false;
    }
    
    let content = fs.readFileSync(API_CONFIG_PATH, 'utf8');
    const oldContent = content;
    
    // Update the OLLAMA_API_HOST constant
    const newApiHost = `const OLLAMA_API_HOST = "http://${ipAddress}:12434";`;
    content = content.replace(/const OLLAMA_API_HOST = "http:\/\/[^:]+:\d+";/, newApiHost);
    
    if (content === oldContent) {
      console.log(`${colors.yellow}⚠ No changes made to API config file. Line might not match the expected format.${colors.reset}`);
      return false;
    }
    
    fs.writeFileSync(API_CONFIG_PATH, content, 'utf8');
    console.log(`${colors.green}✓ Updated API config with IP: ${ipAddress}${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Error updating API config: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Update the debug connection file with the new IP address
 */
function updateDebugConnectionFile(ipAddress) {
  try {
    if (!fs.existsSync(DEBUG_CONNECTION_PATH)) {
      console.log(`${colors.yellow}⚠ Debug connection file not found (skipping)${colors.reset}`);
      return false;
    }
    
    let content = fs.readFileSync(DEBUG_CONNECTION_PATH, 'utf8');
    const oldContent = content;
    
    // Update the API_URL constant
    content = content.replace(/const API_URL = 'http:\/\/[^:]+:\d+';/, `const API_URL = 'http://${ipAddress}:12434';`);
    
    if (content === oldContent) {
      console.log(`${colors.yellow}⚠ No changes needed in debug connection file${colors.reset}`);
      return false;
    }
    
    fs.writeFileSync(DEBUG_CONNECTION_PATH, content, 'utf8');
    console.log(`${colors.green}✓ Updated debug connection file${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Error updating debug connection file: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Update the Ollama proxy file with the new IP address
 */
function updateProxyFile(ipAddress) {
  try {
    if (!fs.existsSync(PROXY_JS_PATH)) {
      console.log(`${colors.yellow}⚠ Proxy file not found (skipping)${colors.reset}`);
      return false;
    }
    
    let content = fs.readFileSync(PROXY_JS_PATH, 'utf8');
    const oldContent = content;
    
    // Update the NETWORK_IP constant
    content = content.replace(/const NETWORK_IP = '[^']+';/, `const NETWORK_IP = '${ipAddress}';`);
    
    if (content === oldContent) {
      console.log(`${colors.yellow}⚠ No changes needed in proxy file${colors.reset}`);
      return false;
    }
    
    fs.writeFileSync(PROXY_JS_PATH, content, 'utf8');
    console.log(`${colors.green}✓ Updated proxy file${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Error updating proxy file: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Get IP address using ipconfig command
 */
function getIpFromIpconfig(callback) {
  exec('ipconfig', (error, stdout, stderr) => {
    if (error) {
      console.log(`${colors.red}✗ Error running ipconfig: ${error.message}${colors.reset}`);
      callback(null);
      return;
    }
    
    const wifiSection = stdout.split('Wireless LAN adapter Wi-Fi:')[1];
    if (!wifiSection) {
      console.log(`${colors.red}✗ Cannot find WiFi adapter in ipconfig output.${colors.reset}`);
      callback(null);
      return;
    }
    
    const ipv4Match = wifiSection.match(/IPv4 Address[.\s]+: ([\d.]+)/);
    if (!ipv4Match || !ipv4Match[1]) {
      console.log(`${colors.red}✗ Cannot extract IPv4 address from ipconfig output.${colors.reset}`);
      callback(null);
      return;
    }
    
    callback(ipv4Match[1]);
  });
}

/**
 * Update all configuration files with the new IP
 */
function updateAllConfigs(ipAddress) {
  console.log(`${colors.green}✓ Detected WiFi IP: ${ipAddress}${colors.reset}`);
  console.log(`\n${colors.blue}Updating configuration files...${colors.reset}`);
  
  // Update API config file (most important)
  const apiUpdated = updateApiConfigFile(ipAddress);
  
  // Update other files
  const debugUpdated = updateDebugConnectionFile(ipAddress);
  const proxyUpdated = updateProxyFile(ipAddress);
  
  // Summary
  console.log(`\n${colors.blue}===== Summary =====${colors.reset}`);
  console.log(`API Config: ${apiUpdated ? colors.green + '✓ Updated' : colors.red + '✗ Failed'}${colors.reset}`);
  console.log(`Debug Connection: ${debugUpdated ? colors.green + '✓ Updated' : colors.yellow + '⚠ Skipped/Unchanged'}${colors.reset}`);
  console.log(`Proxy Config: ${proxyUpdated ? colors.green + '✓ Updated' : colors.yellow + '⚠ Skipped/Unchanged'}${colors.reset}`);
  console.log(`Current WiFi IP: ${ipAddress}`);
  
  if (apiUpdated) {
    console.log(`\n${colors.green}✓ Main configuration updated successfully!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}✗ Failed to update main configuration.${colors.reset}`);
  }
  
  console.log(`Run this script again when you connect to a different WiFi.`);
}

/**
 * Main function
 */
async function main() {
  console.log(`${colors.blue}===== Auto IP Configuration Update =====${colors.reset}`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  
  // Get the WiFi IP address using Node's networkInterfaces
  const ipAddress = getWifiIpAddress();
  
  if (ipAddress) {
    updateAllConfigs(ipAddress);
  } else {
    console.log(`${colors.red}✗ Unable to detect WiFi IP address.${colors.reset}`);
    console.log(`${colors.yellow}Making sure you're connected to WiFi and trying alternative method...${colors.reset}`);
    
    // Try alternative method using ipconfig
    getIpFromIpconfig((detectedIp) => {
      if (detectedIp) {
        updateAllConfigs(detectedIp);
      } else {
        console.log(`${colors.red}✗ All IP detection methods failed. Please check your network connection.${colors.reset}`);
      }
    });
  }
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
}); 