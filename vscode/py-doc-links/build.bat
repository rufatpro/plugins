@echo off
setlocal
cd /d "%~dp0"

for /f %%v in ('node -p "require('./package.json').version"') do set VER=%%v
if "%VER%"=="" (
  echo BUILD FAILED - cannot read version from package.json
  exit /b 1
)

if not exist build mkdir build

call npx vsce package -o "build\py-doc-links-%VER%.vsix" --baseContentUrl "https://github.com/rufatpro/ide-plugins/tree/main/vscode/py-doc-links" > log.1main.log 2> log.1err.log
if %ERRORLEVEL% equ 0 (
  echo BUILD SUCCESSFUL - see log.1main.log
  dir /b "build\*.vsix" 2>nul
) else (
  echo BUILD FAILED - see log.1main.log and log.1err.log
  exit /b %ERRORLEVEL%
)
