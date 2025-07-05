@echo off
echo Restarting FuelSync server with latest changes...
taskkill /f /im node.exe >nul 2>&1
cd /d %~dp0
start cmd /k "npm start"
echo Server restarting in a new window.