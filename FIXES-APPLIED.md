# ✅ CEP 12 Fixes Applied

## What Was Wrong

Your plugin was configured for **CEP 9**, but modern InDesign versions use **CEP 12**. Here's what was broken:

| Issue | Before | After |
|-------|--------|-------|
| Manifest Version | `7.0` | `10.0` (CEP 12 compatible) |
| Host Name | `InDesign` | `IDSN` (correct host ID) |
| CEP Version | `9.0` | `12.0` |
| Debug File | Used `InDesign` | Uses `IDSN` |
| Node.js Support | Not enabled | Enabled with `--enable-nodejs` and `--mixed-context` |

## What I Fixed

### 1. Updated `CSXS/manifest.xml`
- ✅ Changed Version from `7.0` to `10.0`
- ✅ Changed Host Name from `InDesign` to `IDSN`
- ✅ Changed CSXS Version from `9.0` to `12.0`
- ✅ Added CEF command line parameters for Node.js

### 2. Updated `.debug` file
- ✅ Changed Host Name from `InDesign` to `IDSN`
- ✅ Kept debug port at 8088

### 3. Updated Installation Scripts
- ✅ Added CEP 12 debug mode commands (`CSXS.12`)
- ✅ Added log level setting for better debugging

### 4. Created Documentation
- ✅ **CEP12-DEBUG-GUIDE.md** - Complete debugging guide
- ✅ Updated installation instructions

### 5. Rebuilt Plugin
- ✅ Rebuilt with `npm run build`
- ✅ All changes copied to `dist/` folder

---

## 🚀 What You Need To Do Now

### Step 1: Pull Latest Changes
```bash
git pull origin claude/indesign-plugin-generator-011CUY3bmKWvKVcV4hFncqLT
```

### Step 2: Enable Debug Mode

#### macOS:
```bash
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
defaults write com.adobe.CSXS.12 LogLevel 6
```

#### Windows:
1. Open `regedit`
2. Go to `HKEY_CURRENT_USER\Software\Adobe\CSXS.12`
3. Create String Value: `PlayerDebugMode` = `1`
4. Create String Value: `LogLevel` = `6`

### Step 3: Install Plugin

#### macOS:
```bash
./install-mac.sh
```

#### Windows:
```cmd
install-windows.bat
```

Or manually copy `dist/` folder to:
- **macOS:** `~/Library/Application Support/Adobe/CEP/extensions/com.indesign.documentgenerator`
- **Windows:** `%APPDATA%\Adobe\CEP\extensions\com.indesign.documentgenerator`

### Step 4: Restart InDesign

1. **Quit InDesign completely**
2. Restart InDesign
3. Go to **Window > Extensions > Document Generator**

---

## 🐛 If Still Not Working

### Check Logs (macOS):
```bash
# Open logs folder
open ~/Library/Logs/CSXS/

# Look for:
# CEP12-IDSN.log
# CEPHtmlEngine12-IDSN-*.log
```

### Check Logs (Windows):
```
Navigate to: %TEMP%

Look for:
- CEP12-IDSN.log
- CEPHtmlEngine12-IDSN-*.log
```

### Debug in Chrome:
Once plugin loads, open Chrome and go to:
```
http://localhost:8088/
```

### Verify Installation:
```bash
# macOS
ls -la ~/Library/Application\ Support/Adobe/CEP/extensions/com.indesign.documentgenerator/

# Windows
dir "%APPDATA%\Adobe\CEP\extensions\com.indesign.documentgenerator"
```

---

## 📋 Complete File Changes

### Files Modified:
1. `CSXS/manifest.xml` - Updated to CEP 12
2. `.debug` - Fixed host ID
3. `install-mac.sh` - Added CEP 12 debug commands
4. `dist/` - Rebuilt with all updates

### Files Added:
1. `CEP12-DEBUG-GUIDE.md` - Complete debugging guide
2. `FIXES-APPLIED.md` - This file

---

## 🎯 Key Takeaways

1. **InDesign Host ID is `IDSN`** (not "InDesign")
2. **CEP 12 requires Version 10.0+** in manifest
3. **Debug mode must be set for CSXS.12** (not just CSXS.9)
4. **The plugin is ready** - just needs to be installed with debug mode enabled

---

## 📖 Reference Documentation

- **CEP12-DEBUG-GUIDE.md** - Detailed debugging and troubleshooting
- **README.md** - General plugin information
- **INSTALL.md** - Installation instructions
- **QUICK-START.md** - Quick reference guide

---

## ✨ What's Next

1. Pull the latest changes
2. Enable CEP 12 debug mode
3. Run the installation script
4. Restart InDesign
5. Your plugin should now appear in **Window > Extensions > Document Generator**

---

**Last Updated:** This fix was applied on $(date)
**CEP Version:** 12.0
**InDesign Compatibility:** 13.0 - Latest (20.4+)
