@echo off
setlocal
cd /d "%~dp0"
if exist build rmdir /s /q build
if exist log.1main.log del /q log.1main.log
if exist log.1err.log del /q log.1err.log
echo Clean done.
