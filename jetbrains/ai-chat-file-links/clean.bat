@echo off
echo Cleaning plugin build artifacts...

:: Gradle build output
if exist build (
    rmdir /s /q build
    echo   [ok] build\
)

:: Gradle caches
if exist .gradle (
    rmdir /s /q .gradle
    echo   [ok] .gradle\
)

:: IntelliJ Platform plugin caches
if exist .intellijPlatform (
    rmdir /s /q .intellijPlatform
    echo   [ok] .intellijPlatform\
)

:: Kotlin incremental compilation cache
if exist .kotlin (
    rmdir /s /q .kotlin
    echo   [ok] .kotlin\
)

:: Build log files
if exist log.1main.log (
    del /q log.1main.log
    echo   [ok] log.1main.log
)
if exist log.1err.log (
    del /q log.1err.log
    echo   [ok] log.1err.log
)

:: Debug logs in C:\tmp
if exist C:\tmp\ai-chat-file-links-*.log (
    del /q C:\tmp\ai-chat-file-links-*.log
    echo   [ok] C:\tmp\ai-chat-file-links-*.log
)
if exist C:\tmp\acp-path-opener-*.log (
    del /q C:\tmp\acp-path-opener-*.log
    echo   [ok] C:\tmp\acp-path-opener-*.log (legacy)
)

echo.
echo Done. Kept: src\, gradle\, gradlew, gradlew.bat, build.sh, build.bat, clean.sh, *.gradle.kts, *.properties, *.md, .gitignore
