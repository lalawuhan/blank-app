#!/bin/bash

# InDesign Document Generator - macOS Installation Script

echo "🚀 Installing InDesign Document Generator Plugin"
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found. Please run 'npm run build' first."
    exit 1
fi

# Enable debug mode for CEP (including CEP 12)
echo "📝 Enabling CEP debug mode..."
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
defaults write com.adobe.CSXS.12 LogLevel 6
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
defaults write com.adobe.CSXS.10 PlayerDebugMode 1
defaults write com.adobe.CSXS.9 PlayerDebugMode 1

# Create extensions directory if it doesn't exist
CEP_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions"
PLUGIN_DIR="$CEP_DIR/com.indesign.documentgenerator"

echo "📁 Creating extensions directory..."
mkdir -p "$CEP_DIR"

# Remove old installation if exists
if [ -d "$PLUGIN_DIR" ] || [ -L "$PLUGIN_DIR" ]; then
    echo "🗑️  Removing previous installation..."
    rm -rf "$PLUGIN_DIR"
fi

# Copy plugin files
echo "📦 Installing plugin..."
cp -r dist "$PLUGIN_DIR"

# Verify installation
if [ -d "$PLUGIN_DIR" ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Quit InDesign completely if it's running"
    echo "2. Restart InDesign"
    echo "3. Go to Window > Extensions > Document Generator"
    echo ""
    echo "📂 Plugin installed at:"
    echo "$PLUGIN_DIR"
    echo ""
    echo "💡 If the plugin doesn't appear:"
    echo "   • Make sure InDesign is completely closed"
    echo "   • Try restarting your computer"
    echo "   • Check INSTALL.md for troubleshooting"
else
    echo "❌ Installation failed. Please check permissions."
    exit 1
fi
