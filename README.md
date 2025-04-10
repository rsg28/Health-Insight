# Health Insights App

## Project Overview
The Health Insights App is a human-centered mobile application built with React Native that helps users track, visualize, and maintain ownership of their personal health data. The app allows users to manually input key health metrics (steps, sleep hours, water intake, mood) and provides visualizations to help users understand patterns in their personal health data.

The application leverages local AI processing through Ollama to analyze health data and generate personalized insights, ensuring user privacy by keeping all data processing on-device or on your local network. This approach provides AI-powered health analysis without sending sensitive health information to external cloud services.

## Features
- Track daily health metrics with a simple, intuitive interface
- Visualize trends with interactive charts and graphs
- Receive AI-powered insights about your health patterns
- Export your data in various formats
- Complete data ownership and privacy

## Prerequisites
- Node.js (v14 or later)
- npm or yarn
- React Native environment setup
- Docker Desktop installed and running (must be open before setup)
- Ollama installed on your computer
- Cellphone and Laptop must be connected to same WIFI !

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Health-Insight.git
cd Health-Insight
```

### 2. Install dependencies
```bash
# Install main project dependencies
npm install

# Install app-specific dependencies
cd HealthInsightsApp
npm install
cd ..
```

### 3. Configure Ollama
Make sure Ollama is installed and running on your computer:
```bash
# Start Ollama server
ollama serve
```

### 4. Set up the Ollama proxy
The app communicates with Ollama through a proxy server that enables access from your mobile device:

**Important:** Make sure Docker Desktop is open and running before proceeding.

**For Windows users:**
- Double-click the `restart-proxy.bat` file

**For macOS/Linux users:**
```bash
# Start the Docker container for the proxy
docker-compose up -d

# Verify the proxy is working
node checkOllamaProxy.js
```

This will:
- Start the Docker container for the proxy
- Verify the proxy is working correctly
- Show a success message when ready

### 5. Update IP Configuration
Before running the app, you need to configure it to use your current WiFi IP address:

**For Windows users:**
- Double-click the `update-ip.bat` file

**For macOS/Linux users:**
```bash
# Run the auto IP configuration script
node auto-update-ip.js
```

This will automatically detect your WiFi IP address and update all necessary configuration files. This step is crucial for the app to connect to the Ollama server running on your computer from your mobile device.

## Running the Application

### Start the development server
```bash
cd HealthInsightsApp
npm start
```

This will start the Expo development server, which provides several options for running the app:

- Scan the QR code with the Expo Go app on your mobile device
- Press 'a' to run on an Android emulator
- Press 'i' to run on an iOS simulator
- Press 'w' to run in a web browser

### Connecting to a new WiFi network
Whenever you connect to a different WiFi network, you need to update the app's configuration to use your new IP address:

**For Windows users:**
- Double-click the `update-ip.bat` file

**For macOS/Linux users:**
```bash
node auto-update-ip.js
```

The script will automatically:
- Detect your current WiFi IP address
- Update all necessary configuration files
- Ensure the app can connect to the Ollama server

## Architecture

App Structure:
- App.js 
  └─ AppNavigator.js (Tab Navigation)
     ├─ HomeScreen
     │  └─ HealthMetricCard components
     ├─ ChartsScreen
     │  ├─ LineChartComponent 
     │  ├─ ConfidenceIndicator
     │  └─ InsightSourceBadge
     ├─ ExportScreen
     └─ SettingsScreen
        ├─ DataManagementScreen
        └─ HowItWorksScreen

Data Flow:
1. User enters data → saved to device
2. Data loaded → processed → displayed in charts
3. Insights generated from processed data via Ollama API
4. User interacts with insights and visualizations

## Troubleshooting

### Connection Issues
If the app cannot connect to the Ollama server:

1. Verify Ollama is running: `ollama list`
2. Make sure Docker Desktop is open and running
3. Test if the proxy is working:
   - Windows: Double-click `verify-ollama-proxy.bat`
   - macOS/Linux: Run `node checkOllamaProxy.js`
4. Update your IP configuration:
   - Windows: Double-click `update-ip.bat`
   - macOS/Linux: Run `node auto-update-ip.js`
5. If issues persist, restart the Docker proxy:
   - Windows: Double-click `restart-proxy.bat`
   - macOS/Linux: Run `docker-compose down && docker-compose up -d`
6. Ensure your mobile device is on the same WiFi network as your computer

### Debug Connection
To test the connection to the Ollama server:

1. Make sure Docker Desktop is open and the proxy is running
2. Run the debug connection tool:
   - Windows: Double-click the `debug-connection.bat` file
   - macOS/Linux: Run `cd HealthInsightsApp && node debug-connection.js`

The script will show detailed diagnostic information to help identify connection issues.


Great!