# Ollama API Setup Instructions

This guide will help you expose your local Ollama server to your phone app.

## Overview

1. Your Ollama server is running on your computer at `localhost:11434`
2. We've created a Docker configuration that exposes this service on your network
3. Your app is configured to connect to this exposed service

## Step 1: Start Docker Desktop

1. Open Docker Desktop on your Windows computer
2. Wait for Docker to start (look for the green "Docker is running" indicator)

## Step 2: Run the Docker container

1. Open Command Prompt
2. Navigate to your project directory:
   ```
   cd C:\Users\LENOVO\Desktop\SFUCourses\CMPT419\Final\Health-Insight
   ```
3. Start the Docker container:
   ```
   docker-compose up -d
   ```
4. Verify it's running:
   ```
   docker ps
   ```
   You should see an "ollama-proxy" container running.

## Step 3: Test the connection

1. On your computer, open a web browser and go to:
   ```
   http://localhost:8080
   ```
   You should see a response from the Ollama server.

2. Try from your phone browser (must be on the same network):
   ```
   http://209.87.57.234:8080
   ```
   You should see the same response.

## Step 4: Use in your app

Your app is already configured to use the correct endpoint in:
- `HealthInsightsApp/config/apiConfig.js`

If your IP address changes, update this file with your new IP address.

## If you change networks

1. Stop the proxy:
   ```
   docker-compose down
   ```

2. Find your new IP address:
   ```
   ipconfig
   ```
   Look for the IPv4 address of your active network connection.

3. Update the configuration:
   - Edit `HealthInsightsApp/config/apiConfig.js`
   - Change the IP address to your new one

4. Restart the Docker container:
   ```
   docker-compose up -d
   ```

## What we've done

1. Created a Docker Compose setup with an Nginx proxy container
2. The proxy forwards requests from your network to your local Ollama server
3. Updated the app configuration to use this proxy endpoint
4. Made all this work without modifying your Ollama server setup

## Files created/modified

- `docker-compose.yml` - Docker configuration 
- `nginx.conf` - Nginx proxy configuration
- `HealthInsightsApp/config/apiConfig.js` - App endpoint configuration
- `HealthInsightsApp/utils/aiUtils.js` - Updated to use the config
- `HealthInsightsApp/components/AIAdvisorBox.js` - Updated to use the config
- `HealthInsightsApp/scripts/testAIConnection.js` - Updated to use the config 