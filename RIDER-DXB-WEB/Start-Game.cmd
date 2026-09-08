@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
  node serve.mjs --open
  goto end
)
set "RIDER_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%RIDER_NODE%" (
  "%RIDER_NODE%" serve.mjs --open
  goto end
)
echo Node.js is needed to run the local game server.
echo Install Node.js LTS from https://nodejs.org and run this file again.
:end
pause
