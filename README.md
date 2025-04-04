# Health Insights App

## Project Overview
The Health Insights App is a human-centered mobile application built with React Native that helps users track, visualize, and maintain ownership of their personal health data. The app allows users to manually input key health metrics (steps, sleep hours, water intake, mood) and provides visualizations to help users understand patterns in their personal health data.

This project aligns with Track 1: Tools and interfaces for human/data-centered AI from the project proposal by creating a mobile interface that helps users control and explore their personal health data.

<!-- to run ...

npm i
npm start -->

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

.js: Theme styles

Data Flow:
1. User enters data → saved to device
2. Data loaded → processed → displayed in charts
3. Insights generated from processed data