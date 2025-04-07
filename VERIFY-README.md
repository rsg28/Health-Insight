# Ollama Docker Proxy Verification Tools

These tools help you verify that your Ollama Docker proxy setup is working correctly and diagnose any issues that may arise.

## Quick Start

### Windows
Simply double-click the `verify-ollama-proxy.bat` file to run the verification script. It will:
1. Check if Node.js is installed
2. Install any required packages
3. Run the comprehensive diagnostics

If you need to restart the proxy after making changes:
```
restart-proxy.bat
```

### Manual Run
If you prefer to run the script manually:

```bash
# Install the required package
npm install axios

# Run the verification script
node checkOllamaProxy.js
```

## What the Verification Script Checks

The script performs a comprehensive set of checks:

1. **Docker Container**: Verifies if the Ollama proxy container is running
2. **Direct Ollama Connection**: Tests if your local Ollama server is accessible at `localhost:11434`
3. **Local Proxy**: Checks if the proxy is accessible at `localhost:8080`
4. **Network Proxy**: Verifies if the proxy is accessible via your network IP at `209.87.57.234:8080`
5. **Model Test**: Tests if the Ollama model is responding correctly through the proxy

## Common Issues and Fixes

### 404 Not Found for API Endpoints
If you see a 404 error when testing the model, it means the Nginx proxy isn't correctly forwarding API requests. This has been fixed by:
- Using `host.docker.internal` instead of `localhost` to access the host from the container
- Adding a specific location block for `/api/` endpoints in nginx.conf
- Removing the host network mode in favor of the standard Docker networking with port mapping

### Docker Container Not Running
- Make sure Docker Desktop is running
- Start the container with `docker-compose up -d`
- Check container logs with `docker logs $(docker ps -q --filter name=ollama-proxy)`

### Ollama Not Accessible
- Ensure Ollama is installed
- Start Ollama with `ollama serve`
- Verify it's running with `curl http://localhost:11434`

### Proxy Configuration Issues
- Check Docker logs with `docker logs $(docker ps -q --filter name=ollama-proxy)`
- Verify `nginx.conf` is correctly set up
- Restart the container with `restart-proxy.bat`

### Network Access Issues
- Check firewall settings for port 8080
- Verify your network IP is correct (currently using `209.87.57.234`)
- Ensure both devices are on the same network

## Updating Network IP

If your IP address changes, update the following:

1. In `checkOllamaProxy.js`, change the `NETWORK_IP` variable
2. In `HealthInsightsApp/config/apiConfig.js`, update the `OLLAMA_API_HOST` value 