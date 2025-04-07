@echo off
echo Restarting Ollama Docker Proxy...

REM Stop any existing containers
docker-compose down

REM Start the container with the new configuration
docker-compose up -d

REM Wait a moment for the container to start
timeout /t 3 /nobreak > nul

REM Run the verification script to check if it's working
echo.
echo Running verification test...
node checkOllamaProxy.js

echo.
echo Restart process completed.
pause 