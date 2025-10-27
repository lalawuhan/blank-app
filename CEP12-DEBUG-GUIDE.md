# CEP 12 Debugging Guide for InDesign Plugin

## ⚠️ Critical: Enable Debug Mode for CEP 12

Your plugin now uses **CEP 12**, which requires different debug settings than older versions.

### macOS - Enable Debug Mode

Open Terminal and run ALL of these commands:

```bash
# Set Log Level to 6 (maximum logging)
defaults write com.adobe.CSXS.12 LogLevel 6

# Enable Debug Mode
defaults write com.adobe.CSXS.12 PlayerDebugMode 1

# Also enable for CEP 10 and 11 (for backwards compatibility)
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
defaults write com.adobe.CSXS.10 PlayerDebugMode 1
defaults write com.adobe.CSXS.9 PlayerDebugMode 1
```

**Verify it worked:**
```bash
defaults read com.adobe.CSXS.12 PlayerDebugMode
# Should return: 1
```

**If you need to reset:**
```bash
# Kill the preferences cache
killall cfprefsd
# Or restart your Mac
```

### Windows - Enable Debug Mode

1. Press `Win + R` to open Run dialog
2. Type `regedit` and press Enter
3. Navigate to: `HKEY_CURRENT_USER\Software\Adobe\CSXS.12`
   - If `CSXS.12` doesn't exist, create it (Right-click on Adobe > New > Key)
4. Create a new String Value:
   - Right-click in the right pane > New > String Value
   - Name: `PlayerDebugMode`
   - Value: `1`
5. Create another String Value:
   - Name: `LogLevel`
   - Value: `6`
6. Repeat for `CSXS.11`, `CSXS.10`, and `CSXS.9` for compatibility

---

## 📂 Installation Paths (CEP 12)

The plugin must be installed at ONE of these locations:

### macOS
```
~/Library/Application Support/Adobe/CEP/extensions/com.indesign.documentgenerator/
```

### Windows
```
%APPDATA%\Adobe\CEP\extensions\com.indesign.documentgenerator\
```

---

## 🔍 Check Log Files

If the plugin still doesn't appear, check the logs:

### macOS Logs
```bash
# CEP Logs
open ~/Library/Logs/CSXS/

# Look for files like:
# CEP12-IDSN.log
# CEPHtmlEngine12-IDSN-<version>-com.indesign.documentgenerator.log
```

### Windows Logs
```
# CEP Logs location:
%TEMP%

# Look for files like:
# CEP12-IDSN.log
# CEPHtmlEngine12-IDSN-<version>-com.indesign.documentgenerator.log
```

---

## 🐛 Remote Debugging (Port 8088)

Once the plugin loads, you can debug it in Chrome:

1. Make sure InDesign is running with the plugin loaded
2. Open Chrome browser
3. Navigate to: `http://localhost:8088/`
4. You should see the Chrome DevTools for your extension

---

## ✅ Verification Checklist

Before asking for help, verify:

- [ ] Debug mode is enabled for CSXS.12 (not just CSXS.9!)
- [ ] InDesign version is 13.0 or later (CEP 12 works with 20.4+)
- [ ] Plugin is installed at correct path with correct folder name: `com.indesign.documentgenerator`
- [ ] `.debug` file exists and has Port 8088 for IDSN
- [ ] Manifest uses Host Name="IDSN" (not "InDesign")
- [ ] Manifest has Version="10.0" and RequiredRuntime Version="12.0"
- [ ] You've completely quit and restarted InDesign
- [ ] You've restarted your computer (sometimes required)

---

## 🔧 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Plugin doesn't appear in Window > Extensions | Check logs, verify debug mode for CSXS.12, restart computer |
| "Extension could not be loaded" error | Check manifest.xml syntax, verify Host Name is "IDSN" |
| Blank panel | Check console at http://localhost:8088/ for JavaScript errors |
| Port 8088 doesn't work | Verify .debug file, restart InDesign |

---

## 📋 Folder Structure

Your installed plugin should look like this:

```
com.indesign.documentgenerator/
├── .debug                          ← Debug port configuration
├── CSXS/
│   └── manifest.xml               ← CEP 12 manifest
├── extendscript/
│   ├── main.jsx
│   └── json2.js
├── bundle.js                      ← React UI (built)
├── bundle.js.map
└── index.html
```

---

## 🆘 Still Not Working?

1. **Check InDesign version:**
   ```
   InDesign > About InDesign
   ```
   Need version 13.0 or later

2. **Manually check installation:**
   ```bash
   # macOS
   ls -la ~/Library/Application\ Support/Adobe/CEP/extensions/com.indesign.documentgenerator/

   # Windows
   dir "%APPDATA%\Adobe\CEP\extensions\com.indesign.documentgenerator\"
   ```

3. **Check the manifest is valid XML:**
   Open `CSXS/manifest.xml` in a browser - it should parse without errors

4. **Try the system extensions folder instead:**
   - macOS: `/Library/Application Support/Adobe/CEP/extensions/`
   - Windows: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`

---

## 📞 InDesign Host Information

- **Host ID:** `IDSN` (use this in manifest, NOT "InDesign")
- **CEP 12 Support:** InDesign 20.4+
- **CEP 11 Support:** InDesign 16.3+
- **CEP 10 Support:** InDesign 16.0+
- **CEP 9 Support:** InDesign 14.0 - 15.x

Your manifest now supports InDesign 13.0+ with CEP 12.
