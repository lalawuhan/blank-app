# 🚀 Quick Setup Guide - UXP Plugin

## ✨ You're Using UXP Now!

This is a **UXP plugin** (the modern architecture), not CEP. Much simpler!

---

## 🎯 Installation (3 Steps)

### Step 1: Enable UXP Developer Mode

1. Open **InDesign**
2. Go to **InDesign > Preferences > General** (macOS) or **Edit > Preferences > General** (Windows)
3. Check **"Enable UXP Developer Mode"**
4. Click OK
5. **Restart InDesign**

### Step 2: Install UXP Developer Tool

1. Download from: https://developer.adobe.com/photoshop/uxp/devtool/
2. Install the application
3. Launch **UXP Developer Tool**

### Step 3: Load Your Plugin

1. In UXP Developer Tool, click **"Add Plugin"**
2. Navigate to your plugin folder
3. Select the **`manifest.json`** file
4. Click **"Load"** or **"Watch"**

---

## ✅ Using the Plugin

### In InDesign:

1. **Window > Document Generator** (plugin panel appears)
2. **Open your template document**
3. Make sure it has a frame labeled **"ImageFrame"** on the Parent Page
4. In the plugin:
   - Click **"Choose Folder"** → Select images folder
   - Click **"Choose Folder"** → Select output folder
   - Click **"Generate All Documents"**

Done! The plugin creates one .indd file per image.

---

## 🐛 Troubleshooting

### Plugin doesn't appear in Window menu?

1. **Check UXP Developer Mode** is enabled in InDesign preferences
2. **Restart InDesign** after enabling
3. **Reload plugin** in UXP Developer Tool
4. **Check manifest.json** is valid JSON

### File picker doesn't work?

1. **Check permissions** in manifest.json:
   ```json
   "requiredPermissions": [
     {
       "module": "fs",
       "requiredAccess": "readAndWrite"
     }
   ]
   ```

2. **Reload plugin** after any manifest changes

### "Document not found" error?

1. **Open your template** in InDesign BEFORE using plugin
2. **Save your template** (File > Save)
3. Plugin uses the currently open document

### Debugging:

1. **Open DevTools:** Plugins > Development > Developer Console
2. **Check console** for JavaScript errors
3. **Add console.log()** to your code:
   ```javascript
   console.log("Debug:", imageFile.name);
   ```

---

## 📁 Your Plugin Structure

```
your-plugin/
├── manifest.json          ← UXP manifest (load this!)
├── index.html            ← UI
├── index.js              ← UI logic
├── indesign-logic.js     ← InDesign automation
└── icons/
    └── icon.png          ← Plugin icon (24x24 px)
```

---

## 💡 Key Differences from CEP

| CEP (Old) | UXP (New) |
|-----------|-----------|
| CEP/extensions/ folder | Load via UXP Developer Tool |
| manifest.xml | manifest.json |
| ExtendScript .jsx | InDesign DOM API |
| Debug mode required | No debug mode needed |
| File/Folder objects | uxp.storage API |
| Slow performance | Fast performance |

---

## 🔥 Hot Reload

With UXP Developer Tool in **"Watch"** mode:

1. Edit your code
2. Save
3. Plugin auto-reloads!

No need to restart InDesign! 🎉

---

## 📦 Distribution

When ready to share:

1. **Package the plugin:**
   ```bash
   uxp package
   ```

2. This creates a **`.ccx`** file

3. Users install via:
   - Creative Cloud Desktop app
   - Or Adobe Exchange

---

## 🎨 Customize

### Change panel size:

Edit `manifest.json`:
```json
"minimumSize": {
  "width": 400,
  "height": 600
}
```

### Change colors:

Edit styles in `index.html`:
```css
body {
  background-color: #262626;
  color: #e0e0e0;
}
```

### Add features:

1. Edit `index.js` for UI logic
2. Edit `indesign-logic.js` for InDesign automation
3. Reload in UXP Developer Tool

---

## 📚 Resources

- **UXP Docs:** https://developer.adobe.com/indesign/uxp/
- **InDesign DOM:** https://developer.adobe.com/indesign/dom/api/
- **UXP Developer Tool:** https://developer.adobe.com/photoshop/uxp/devtool/
- **Sample Plugins:** https://github.com/AdobeDocs/uxp-indesign-samples

---

## ✨ Summary

**Installation:**
1. Enable UXP Developer Mode in InDesign preferences
2. Install UXP Developer Tool
3. Load plugin via manifest.json

**Usage:**
1. Open template in InDesign
2. Window > Document Generator
3. Select folders and generate!

**Development:**
- Use "Watch" mode for hot reload
- Open Developer Console for debugging
- Edit code and save to see changes

---

**UXP is much simpler than CEP!** No debug registry keys, no special folders, no ExtendScript headaches. Just modern JavaScript! 🎉
