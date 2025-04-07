@echo off
echo Running Ollama Docker Proxy verification...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Error: Node.js is not installed or not in PATH
  echo Please install Node.js from https://nodejs.org/
  exit /b 1
)

REM Check if axios is installed
node -e "try{require('axios')}catch(e){process.exit(1)}" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Installing axios package...
  npm install axios --no-save
  if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install required packages
    exit /b 1
  )
)

REM Run the verification script
node checkOllamaProxy.js

echo.
echo Verification completed.
pause 