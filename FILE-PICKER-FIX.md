# ✅ File Selection Dialog Fixed!

## What Was Broken

When you clicked "Choose Template" or "Choose Folder" buttons, nothing happened or you got errors. This was because:

1. ❌ ExtendScript functions returned JavaScript objects
2. ❌ CEP's `evalScript` callback only receives **strings**
3. ❌ File filter format wasn't cross-platform compatible

---

## What I Fixed

### All ExtendScript Functions Now Return JSON Strings

**Before:**
```javascript
function selectFile(prompt, filter) {
    var file = File.openDialog(prompt, filter);
    if (file) {
        return { success: true, path: file.fsName };  // ❌ Returns object
    }
}
```

**After:**
```javascript
function selectFile(prompt, filter) {
    try {
        var file = File.openDialog(prompt, function(f) {
            if (f instanceof Folder) return true;
            var name = f.name.toLowerCase();
            return name.indexOf('.indd') > -1 || name.indexOf('.indt') > -1;
        });

        if (file) {
            return JSON.stringify({
                success: true,
                path: file.fsName
            });  // ✅ Returns JSON string
        }
    } catch (e) {
        return JSON.stringify({
            success: false,
            message: "Error: " + e.message
        });
    }
}
```

### Changes Made

| Function | Change |
|----------|--------|
| `selectFile()` | Returns JSON string, uses function-based filter |
| `selectFolder()` | Returns JSON string, added error handling |
| `generateDocuments()` | Returns JSON string |
| `exportDocument()` | Returns JSON string |

---

## 🚀 Update Your Plugin

### Step 1: Pull Latest Changes
```bash
git pull origin claude/indesign-plugin-generator-011CUY3bmKWvKVcV4hFncqLT
```

### Step 2: Rebuild (if needed)
```bash
npm run build
```

### Step 3: Reinstall

**macOS:**
```bash
./install-mac.sh
```

**Windows:**
```cmd
install-windows.bat
```

Or manually copy `dist/` to:
- **macOS:** `~/Library/Application Support/Adobe/CEP/extensions/com.indesign.documentgenerator`
- **Windows:** `%APPDATA%\Adobe\CEP\extensions\com.indesign.documentgenerator`

### Step 4: Restart InDesign

1. **Quit InDesign completely**
2. Restart InDesign
3. Open **Window > Extensions > Document Generator**

---

## ✨ Test It Out

Now you should be able to:

1. ✅ Click "Choose Template" → File picker opens → Select .indd or .indt file
2. ✅ Click "Choose Folder" (Images) → Folder picker opens → Select folder with images
3. ✅ Click "Choose Folder" (Output) → Folder picker opens → Select output location
4. ✅ Click "Generate All Documents" → Creates 30 documents (one per image)
5. ✅ Click "Export PDF & PNGs" → Exports active document

---

## 🐛 Debugging Tips

If dialogs still don't open:

### 1. Check Chrome DevTools
```
http://localhost:8088/
```
Look for JavaScript errors in the console

### 2. Check ExtendScript Errors

In InDesign:
- Window > Utilities > ExtendScript Toolkit (if available)
- Or check CEP logs (see CEP12-DEBUG-GUIDE.md)

### 3. Test ExtendScript Directly

Try running this in ExtendScript Toolkit or ESTK:
```javascript
var file = File.openDialog("Select a file");
if (file) {
    alert(file.fsName);
}
```

If this works, the problem is in the communication layer.

---

## 📋 What Each Function Does Now

### selectFile(prompt, filter)
- Opens native file picker dialog
- Filters for .indd and .indt files
- Returns JSON: `{success: true/false, path: "...", message: "..."}`

### selectFolder(prompt)
- Opens native folder picker dialog
- Returns JSON: `{success: true/false, path: "...", message: "..."}`

### generateDocuments(params)
- Takes: `{templatePath, imageFolder, outputFolder}`
- Creates one .indd file per image in folder
- Updates "ImageFrame" on Parent Page for each
- Returns JSON: `{success, message, processedCount, totalImages}`

### exportDocument(params)
- Takes: `{outputFolder}`
- Exports active document to PDF
- Exports all pages as PNGs (300 DPI)
- Returns JSON: `{success, message, pdfPath, pngFolder}`

---

## 🎯 Next Steps

1. Pull the latest code
2. Reinstall the plugin
3. Restart InDesign
4. Test file selection buttons
5. Try generating documents with test images

---

## 📞 Still Having Issues?

If file dialogs still don't work:

1. **Check InDesign version:** Needs 13.0 or later
2. **Check logs:** See CEP12-DEBUG-GUIDE.md
3. **Debug in Chrome:** Go to http://localhost:8088/
4. **Test ExtendScript:** Run test script in ESTK

---

**File selection should now work perfectly!** 🎉
