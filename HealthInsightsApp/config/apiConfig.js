/**
 * API Configuration
 * 
 * Set the OLLAMA_API_HOST to your computer's IP address when running on a phone
 * Example: "http://192.168.1.100:12434" (replace with your actual IP)
 */

// For development on computer (using localhost)
// const OLLAMA_API_HOST = "http://localhost:11434";

// For running on phone (using your computer's IP and the nginx proxy)
// Your Wi-Fi IP address as detected by ipconfig
const OLLAMA_API_HOST = "http://209.87.57.234:12434";

export default OLLAMA_API_HOST; 