# ✨ Simplified Plugin - Super Easy to Use!

## 🎯 What Changed

**REMOVED:**
- ❌ Template file picker button (was causing errors)
- ❌ Confusing file selection dialog

**SIMPLIFIED:**
- ✅ Just open your template in InDesign first
- ✅ Plugin uses the currently open document
- ✅ Only 2 folder selections needed

---

## 🚀 New Workflow (3 Simple Steps)

### **Step 1: Open Your Template in InDesign**
1. Launch InDesign
2. File > Open > Select your template (e.g., `Blank_Table_Numbers.indd`)
3. **Make sure you see your template document open**

### **Step 2: Prepare Your Template**
Make sure your template has:
- A frame on the **Parent Page** (Master Page)
- That frame's **Script Label** set to `ImageFrame`

To set the Script Label:
1. Go to Parent Pages panel
2. Select the background frame
3. Window > Utilities > Script Label
4. Enter: `ImageFrame`
5. File > Save

### **Step 3: Use the Plugin**
1. Window > Extensions > **Document Generator**
2. You'll see a warning box at the top saying "Before You Start"
3. Click **"Choose Folder"** under Images Folder → Select folder with your background images
4. Click **"Choose Folder"** under Output Folder → Select where to save documents
5. Click **"Generate All Documents"**

**That's it!** The plugin will:
- Use your currently open document as the template
- Create one .indd file for each image
- Update the ImageFrame with each image
- Save all files to your output folder

---

## 📋 Complete Example

```
1. Open InDesign
2. Open "My_Template.indd"
3. Window > Extensions > Document Generator
4. Select Images Folder: "/Users/me/Desktop/Backgrounds/"
5. Select Output Folder: "/Users/me/Desktop/Output/"
6. Click "Generate All Documents"

Result: 30 new .indd files in /Users/me/Desktop/Output/
  - Background_01.indd
  - Background_02.indd
  - Background_03.indd
  - ... (one for each image)
```

---

## ⚠️ Important Notes

### ✅ DO:
- **Open your template document BEFORE using the plugin**
- **Save your template** (File > Save) before generating
- Make sure ImageFrame exists on Parent Page
- Use images that fit your frame size

### ❌ DON'T:
- Don't close your template while plugin is running
- Don't try to generate without opening a document first
- Don't use unsaved documents

---

## 🐛 Error Messages & Solutions

| Error | Solution |
|-------|----------|
| "Please open your template document in InDesign first" | Open your .indd file before using plugin |
| "Please save your template document before generating copies" | File > Save your template |
| "Image folder not found" | Make sure folder exists and has images |
| "Could not find ImageFrame" | Add Script Label "ImageFrame" to frame on Parent Page |
| "No image files found" | Check that folder contains .jpg, .png, .tif, .psd, .ai, or .pdf files |

---

## 💡 Tips

1. **Test with 2-3 images first** before running all 30
2. **Save your template** - the plugin won't work with unsaved documents
3. **Name your images properly** - they become the document names (e.g., `Art_01.jpg` → `Art_01.indd`)
4. **Close other InDesign documents** to avoid confusion
5. **The plugin is fast** - 30 documents typically complete in under 5 minutes

---

## 🎨 Example Setup

### Your Template Structure:
```
My_Template.indd
├── Page 1-30 (regular pages)
└── A-Master (Parent Page)
    └── Rectangle Frame
        ├── Script Label: "ImageFrame"
        └── Size: Your desired background size
```

### Your Images Folder:
```
Backgrounds/
├── Art_01.jpg
├── Art_02.jpg
├── Art_03.jpg
├── ... (up to 30 images)
└── Art_30.jpg
```

### Plugin Will Create:
```
Output/
├── Art_01.indd (30 pages, Art_01.jpg background)
├── Art_02.indd (30 pages, Art_02.jpg background)
├── Art_03.indd (30 pages, Art_03.jpg background)
├── ...
└── Art_30.indd (30 pages, Art_30.jpg background)
```

---

## 🔄 Update Your Plugin

Pull the latest simplified version:

```bash
git pull origin claude/indesign-plugin-generator-011CUY3bmKWvKVcV4hFncqLT
```

Reinstall:

**macOS:**
```bash
./install-mac.sh
```

**Windows:**
```cmd
install-windows.bat
```

Restart InDesign.

---

## ✅ What You'll See Now

The new plugin interface shows:

1. **⚠️ Before You Start** (green warning box)
   - Clear instructions to open document first

2. **Generate Documents** section
   - Images Folder picker
   - Output Folder picker
   - Generate button

3. **Export Active Document** section
   - Export Folder picker
   - Export button

**No more template file picker!** Much simpler! 🎉

---

## 🎯 Summary

| Old Way | New Way |
|---------|---------|
| 1. Click "Choose Template" | 1. Open template in InDesign |
| 2. File dialog appears | 2. Plugin sees it automatically |
| 3. Select .indd file | 3. Select folder directly |
| 4. Click other buttons | 4. Click Generate |

**New way = Simpler, faster, no file dialog issues!**
