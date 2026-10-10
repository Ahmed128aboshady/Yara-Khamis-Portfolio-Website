@echo off
cd /d "%~dp0"
echo Open http://127.0.0.1:4174 in your browser.
where node >nul 2>nul
if errorlevel 1 goto bundled
node server.cjs
goto end
:bundled
"C:\Users\Video Editor\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.cjs
:end
pause
