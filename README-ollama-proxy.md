# Ollama Server Proxy

This setup exposes your local Ollama server running on `localhost:11434` to make it accessible from your phone or other devices on your local network.

## Prerequisites

- Docker and Docker Compose installed
- Ollama server running on localhost:11434

## Configuration

The configuration is already set up with:
- Your computer's IP address: `209.87.57.234`
- Proxy port: `8080`
- The app will connect to: `http://209.87.57.234:8080`

## Usage

1. Start the proxy:
   ```
   docker-compose up -d
   ```

2. Verify the proxy is working by opening this URL in your browser:
   ```
   http://209.87.57.234:8080
   ```
   You should see a response from the Ollama server.

3. The app is already configured to use this endpoint in:
   - `HealthInsightsApp/config/apiConfig.js`

## Stopping the Proxy

```
docker-compose down
```

## IP Address Changes

If your computer's IP address changes (e.g., connecting to a different network):

1. Run `ipconfig` to find your new IP address
2. Update `HealthInsightsApp/config/apiConfig.js` with the new IP address
3. Restart the Docker container:
   ```
   docker-compose down
   docker-compose up -d
   ```

## Troubleshooting

- Make sure your computer's firewall allows incoming connections on port 8080
- Ensure both devices are on the same network
- If using Windows, you might need to run Docker Desktop with administrator privileges
- Check if your network allows device-to-device communication (some public networks restrict this) 