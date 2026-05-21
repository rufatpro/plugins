@echo off
setlocal enabledelayedexpansion
set FAILED=0
echo Cleaning plugin build artifacts...

:: Gradle build output
if exist build (
    rmdir /s /q build
    if exist build (
        echo   [fail] build\ is locked or not deleted
        set FAILED=1
    ) else (
        echo   [ok] build\
    )
)

:: Gradle caches
if exist .gradle (
    rmdir /s /q .gradle
    if exist .gradle (
        echo   [fail] .gradle\ is locked or not deleted
        set FAILED=1
    ) else (
        echo   [ok] .gradle\
    )
)

:: IntelliJ Platform plugin caches
if exist .intellijPlatform (
    rmdir /s /q .intellijPlatform
    if exist .intellijPlatform (
        echo   [fail] .intellijPlatform\ is locked or not deleted
        set FAILED=1
    ) else (
        echo   [ok] .intellijPlatform\
    )
)

:: Kotlin incremental compilation cache
if exist .kotlin (
    rmdir /s /q .kotlin
    if exist .kotlin (
        echo   [fail] .kotlin\ is locked or not deleted
        set FAILED=1
    ) else (
        echo   [ok] .kotlin\
    )
)

:: Build log files
if exist log.1main.log (
    del /q log.1main.log
    if exist log.1main.log (
        echo   [fail] log.1main.log not deleted
        set FAILED=1
    ) else (
        echo   [ok] log.1main.log
    )
)
if exist log.1err.log (
    del /q log.1err.log
    if exist log.1err.log (
        echo   [fail] log.1err.log not deleted
        set FAILED=1
    ) else (
        echo   [ok] log.1err.log
    )
)
if exist log.clean.log (
    del /q log.clean.log
    if exist log.clean.log (
        echo   [fail] log.clean.log not deleted
        set FAILED=1
    ) else (
        echo   [ok] log.clean.log
    )
)

:: Debug logs in C:\tmp
if exist C:\tmp\py-doc-links-*.log (
    del /q C:\tmp\py-doc-links-*.log
    if exist C:\tmp\py-doc-links-*.log (
        echo   [fail] C:\tmp\py-doc-links-*.log not deleted
        set FAILED=1
    ) else (
        echo   [ok] C:\tmp\py-doc-links-*.log
    )
)

echo.
if "!FAILED!"=="0" (
    echo Done. Kept: src\, gradle\, gradlew, gradlew.bat, build.bat, clean.bat, *.gradle.kts, *.properties, *.md, .gitignore
) else (
    echo Clean finished with errors. Close IDE/Gradle daemons and rerun.
    exit /b 1
)
