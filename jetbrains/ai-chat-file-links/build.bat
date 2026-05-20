@echo off
cd /d "%~dp0"
call gradlew.bat buildPlugin > log.1main.log 2> log.1err.log
if %ERRORLEVEL% equ 0 (
    echo BUILD SUCCESSFUL — see log.1main.log
    dir /b build\distributions\*.zip 2>nul
) else (
    echo BUILD FAILED — see log.1main.log and log.1err.log
    exit /b %ERRORLEVEL%
)
