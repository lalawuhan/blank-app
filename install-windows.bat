@echo off
REM InDesign Document Generator - Windows Installation Script

echo Installing InDesign Document Generator Plugin
echo.

REM Check if dist folder exists
if not exist "dist" (
    echo Error: dist folder not found. Please run 'npm run build' first.
    exit /b 1
)

REM Set installation path
set CEP_DIR=%APPDATA%\Adobe\CEP\extensions
set PLUGIN_DIR=%CEP_DIR%\com.indesign.documentgenerator

echo Creating extensions directory...
if not exist "%CEP_DIR%" mkdir "%CEP_DIR%"

REM Remove old installation if exists
if exist "%PLUGIN_DIR%" (
    echo Removing previous installation...
    rmdir /s /q "%PLUGIN_DIR%"
)

echo Installing plugin...
xcopy /E /I /Y dist "%PLUGIN_DIR%"

REM Check installation
if exist "%PLUGIN_DIR%" (
    echo.
    echo Installation complete!
    echo.
    echo Next steps:
    echo 1. Enable debug mode ^(see INSTALL.md^)
    echo 2. Quit InDesign completely if it's running
    echo 3. Restart InDesign
    echo 4. Go to Window ^> Extensions ^> Document Generator
    echo.
    echo Plugin installed at:
    echo %PLUGIN_DIR%
    echo.
    echo If the plugin doesn't appear:
    echo   - Enable CEP debug mode ^(see INSTALL.md^)
    echo   - Make sure InDesign is completely closed
    echo   - Try restarting your computer
) else (
    echo Installation failed. Please check permissions.
    exit /b 1
)

pause
