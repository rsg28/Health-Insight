# Troubleshooting Ollama API Connection Issues

If your app is having trouble connecting to the Ollama API through the Docker proxy, this guide will help you diagnose and fix the problem.

## Testing Tools

We've created several diagnostic tools to help troubleshoot connection issues:

1. **Web-based test tool**: Open `test-ollama-api.html` in your phone's browser
2. **Node.js debug script**: Run `node HealthInsightsApp/debug-connection.js` 
3. **Verification script**: Run `node checkOllamaProxy.js`

## Common Issues and Solutions

### 1. Model not found

**Symptoms:**
- Error messages about model not being available
- API works but model generation fails

**Possible causes:**
- The model name in your app doesn't match what's available on your Ollama server

**Solutions:**
- Check available models: `ollama list`
- Make sure "llama3" is downloaded: `ollama pull llama3` 
- Try a different model name in your app's configuration

### 2. Docker container not running

**Symptoms:**
- All connection attempts fail
- Can't access the URL from any device

**Solutions:**
- Make sure Docker Desktop is running
- Start the container: `docker-compose up -d`
- Verify it's running: `docker ps` (look for "health-insight-ollama-proxy-1")

### 3. Wrong IP address

**Symptoms:**
- Works on your computer but not on phone
- Error connecting from mobile device

**Solutions:**
- Run `ipconfig` to check your current IP address
- Update `HealthInsightsApp/config/apiConfig.js` with the correct IP
- Restart your app

### 4. Network restrictions

**Symptoms:**
- Works in browser but not in app
- Inconsistent connectivity

**Solutions:**
- Make sure your phone and computer are on the same network
- Check if your network allows device-to-device communication
- Try using a hotspot from your phone instead of a corporate/school network
- Use an uncommon port (we've changed to 12434) to avoid network conflicts

### 5. Ollama server not running

**Symptoms:**
- Docker container works but API calls fail
- "Could not connect to Ollama server" errors

**Solutions:**
- Start Ollama: `ollama serve`
- Make sure it's running on port 11434
- Verify with: `curl http://localhost:11434`

### 6. Port conflicts

**Symptoms:**
- Connecting to the IP:port shows a different server than expected
- University/corporate networks often redirect common ports

**Solutions:**
- We've changed from port 8080 to port 12434 to avoid conflicts
- If still having issues, try an even more obscure port number

## How to Test API Connectivity

1. **Basic connectivity test in browser**
   - Open a browser on your phone and go to `http://[YOUR-IP]:12434`
   - You should see a response (usually "Ollama Server")

2. **API endpoint test**
   - Open the HTML test page on your phone
   - Click "Test Model Generation"
   - If it works in browser but not in app, the issue is app-specific

3. **Check logs**
   - Look at Docker container logs: `docker logs health-insight-ollama-proxy-1`
   - Look for errors or failed connection attempts

## Model Availability

Make sure you're using a model that's actually installed on your Ollama server:

```bash
# List all available models
ollama list

# If llama3 is not listed, download it
ollama pull llama3
```

## Network Setup 

The Docker container exposes the Ollama server (running on `localhost:11434`) 
to your local network on port 12434. Your app needs to connect to:

```
http://[YOUR-COMPUTER-IP]:12434
```

Where `[YOUR-COMPUTER-IP]` is your computer's IP address on your local network. 