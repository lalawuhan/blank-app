# Quick Start Guide

## 🎯 You're here because the plugin didn't appear in InDesign

The plugin has been **built successfully**, but it needs to be **installed on your local machine** where InDesign is running.

## 📦 What You Need

This repository now contains everything you need:
- ✅ Built plugin in the `dist/` folder
- ✅ Installation scripts for Mac and Windows
- ✅ Complete documentation

## 🚀 Installation (Choose Your OS)

### macOS

1. Open Terminal in this project folder
2. Run:
   ```bash
   ./install-mac.sh
   ```
3. Restart InDesign
4. Go to **Window > Extensions > Document Generator**

### Windows

1. Open Command Prompt in this project folder
2. Run:
   ```cmd
   install-windows.bat
   ```
3. **Enable debug mode** (see INSTALL.md for registry instructions)
4. Restart InDesign
5. Go to **Window > Extensions > Document Generator**

## 🔧 If Plugin Still Doesn't Appear

### 1. Enable Debug Mode

**macOS:**
```bash
defaults write com.adobe.CSXS.9 PlayerDebugMode 1
defaults write com.adobe.CSXS.10 PlayerDebugMode 1
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
```

**Windows:**
- Run `regedit`
- Navigate to: `HKEY_CURRENT_USER\Software\Adobe\CSXS.9`
- Create String Value: `PlayerDebugMode` = `1`
- Repeat for CSXS.10 and CSXS.11

### 2. Verify Installation Path

The plugin must be at:

**macOS:**
```
~/Library/Application Support/Adobe/CEP/extensions/com.indesign.documentgenerator/
```

**Windows:**
```
%APPDATA%\Adobe\CEP\extensions\com.indesign.documentgenerator\
```

### 3. Check InDesign Version

- Requires InDesign CC 2018 or later
- Check Help > About InDesign

### 4. Restart Everything

1. Quit InDesign completely
2. Restart your computer
3. Launch InDesign
4. Check Window > Extensions

## 📖 Full Documentation

See `INSTALL.md` for detailed troubleshooting and manual installation instructions.

## 🎨 Using the Plugin

Once it appears in Window > Extensions:

1. **Prepare your template:**
   - Select the background frame on the Parent/Master Page
   - Set Script Label to `ImageFrame` (Window > Utilities > Script Label)

2. **Generate documents:**
   - Choose template file
   - Select images folder
   - Select output folder
   - Click "Generate All Documents"

## ❓ Still Having Issues?

Common problems:

| Problem | Solution |
|---------|----------|
| Plugin not in menu | Enable debug mode + restart InDesign |
| Wrong folder location | Use installation script or check INSTALL.md |
| InDesign crashes | Check InDesign version (need CC 2018+) |
| "ImageFrame not found" | Add Script Label to frame on Parent Page |

---

**Need the built plugin?** It's in the `dist/` folder, ready to install!
