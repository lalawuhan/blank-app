# Installation Instructions

## ✅ Plugin Build Complete!

The plugin has been built successfully in the `dist` folder.

## Step 1: Enable Debug Mode (First Time Only)

Before installing, you need to enable CEP debug mode:

### macOS
Open Terminal and run:
```bash
defaults write com.adobe.CSXS.9 PlayerDebugMode 1
defaults write com.adobe.CSXS.10 PlayerDebugMode 1
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
```

### Windows
1. Press `Win + R` to open Run dialog
2. Type `regedit` and press Enter
3. Navigate to: `HKEY_CURRENT_USER\Software\Adobe\CSXS.9`
4. Create a new String Value named `PlayerDebugMode` with value `1`
5. Repeat for `CSXS.10` and `CSXS.11` if those keys exist

## Step 2: Install the Plugin

### Option A: Manual Installation

Copy the entire `dist` folder to your CEP extensions directory:

**macOS:**
```bash
mkdir -p ~/Library/Application\ Support/Adobe/CEP/extensions/
cp -r dist ~/Library/Application\ Support/Adobe/CEP/extensions/com.indesign.documentgenerator
```

**Windows:**
```cmd
mkdir "%APPDATA%\Adobe\CEP\extensions"
xcopy /E /I dist "%APPDATA%\Adobe\CEP\extensions\com.indesign.documentgenerator"
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Force -Path "$env:APPDATA\Adobe\CEP\extensions"
Copy-Item -Recurse -Force dist "$env:APPDATA\Adobe\CEP\extensions\com.indesign.documentgenerator"
```

### Option B: Symlink Installation (for development)

**macOS/Linux:**
```bash
ln -s "$(pwd)/dist" ~/Library/Application\ Support/Adobe/CEP/extensions/com.indesign.documentgenerator
```

**Windows (Command Prompt as Administrator):**
```cmd
mklink /D "%APPDATA%\Adobe\CEP\extensions\com.indesign.documentgenerator" "%CD%\dist"
```

## Step 3: Restart InDesign

1. Quit InDesign completely
2. Relaunch InDesign
3. Go to **Window > Extensions**
4. You should see **"Document Generator"** in the list
5. Click it to open the plugin panel

## Troubleshooting

### Plugin doesn't appear in Window > Extensions

1. **Check installation path:** Make sure the folder is named exactly `com.indesign.documentgenerator`

   **macOS:** `~/Library/Application Support/Adobe/CEP/extensions/com.indesign.documentgenerator`

   **Windows:** `%APPDATA%\Adobe\CEP\extensions\com.indesign.documentgenerator`

2. **Verify debug mode is enabled:**

   **macOS:** Run in Terminal:
   ```bash
   defaults read com.adobe.CSXS.9 PlayerDebugMode
   ```
   Should return `1`

   **Windows:** Check Registry Editor at `HKEY_CURRENT_USER\Software\Adobe\CSXS.9` for `PlayerDebugMode = 1`

3. **Check folder contents:** The folder should contain:
   ```
   com.indesign.documentgenerator/
   ├── .debug
   ├── CSXS/
   │   └── manifest.xml
   ├── extendscript/
   │   ├── main.jsx
   │   └── json2.js
   ├── bundle.js
   └── index.html
   ```

4. **Try different CEP versions:** Some InDesign versions use different CEP versions:
   - InDesign 2018-2019: CSXS.8 or CSXS.9
   - InDesign 2020-2021: CSXS.9 or CSXS.10
   - InDesign 2022+: CSXS.10 or CSXS.11

5. **Restart your computer:** Sometimes InDesign needs a full system restart to detect new extensions.

### Plugin appears but shows errors

- Check the InDesign Console: Window > Utilities > ExtendScript Toolkit
- Look for JavaScript errors in the CEP console (enable debug mode first)

## Next Steps

Once the plugin appears:

1. **Prepare your template:**
   - Open your InDesign template
   - Go to Parent Pages (Master Pages)
   - Select the frame for background images
   - Window > Utilities > Script Label
   - Set label to: `ImageFrame`
   - Save template

2. **Use the plugin:**
   - Choose your template file
   - Select folder with background images
   - Select output folder
   - Click "Generate All Documents"

## Need Help?

If the plugin still doesn't appear after following all steps:
1. Check InDesign version compatibility (CC 2018 or later)
2. Verify folder permissions
3. Look for error logs in the CEP console
4. Try the symlink method if manual copy doesn't work
