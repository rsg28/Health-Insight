@echo off
echo Running Ollama Connection Diagnostic...
echo This will test the connection to your Ollama server.
echo.

cd HealthInsightsApp
node debug-connection.js

echo.
echo Diagnostic completed.
echo Press any key to exit...
pause > nul 