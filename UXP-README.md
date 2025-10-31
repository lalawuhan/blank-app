# UXP InDesign Document Generator

This is a **UXP plugin** (not CEP!) for Adobe InDesign 2023+.

## Key Differences: UXP vs CEP

| Feature | CEP (Old) | UXP (New) |
|---------|-----------|-----------|
| Architecture | HTML + ExtendScript | Modern JavaScript + InDesign DOM |
| File System | ExtendScript File/Folder | UXP `uxp.storage` |
| Manifest | manifest.xml | manifest.json |
| Install Location | CEP/extensions/ | Plugins/ folder |
| Debug Mode | Required | Not required |
| Node.js | Limited support | Full modern Node.js |

## Installation

### For Development

1. **Enable UXP Developer Mode** in InDesign:
   - InDesign > Preferences > General > Enable UXP Developer Mode

2. **Load the plugin:**
   - Open UXP Developer Tool (comes with Creative Cloud)
   - Click "Add Plugin"
   - Select the `manifest.json` file in this folder
   - Click "Load"

3. **Open in InDesign:**
   - Window > Document Generator

### For Distribution

1. Package the plugin:
   ```bash
   # Create a .ccx file using UXP Packager
   uxp package
   ```

2. Distribute the .ccx file
3. Users install via Creative Cloud Desktop app

## File Structure

```
indesign-document-generator/
├── manifest.json           # UXP manifest (NOT manifest.xml!)
├── index.html             # UI layout
├── index.js               # UI logic (event handlers)
├── indesign-logic.js      # InDesign DOM automation
├── icons/
│   └── icon.png           # Plugin icon
└── README.md              # This file
```

## Usage

1. **Open your template** in InDesign
2. **Make sure** it has a frame labeled "ImageFrame" on the Parent Page
3. **Open the plugin**: Window > Document Generator
4. **Select folders**:
   - Images folder (with background images)
   - Output folder (where to save generated documents)
5. **Click "Generate All Documents"**

The plugin will:
- Use your open document as the template
- Create one .indd file per image
- Update "ImageFrame" with each image
- Save all documents to your output folder

## API Differences

### File System

**CEP (ExtendScript):**
```javascript
var folder = Folder.selectDialog("Choose folder");
var file = new File(folder.fsName + "/test.indd");
```

**UXP:**
```javascript
const folder = await fs.getFolder();
const file = await folder.createFile("test.indd");
```

### InDesign DOM

**CEP:**
```javascript
frame.fit(FitOptions.proportionallyFillFrame);
```

**UXP:**
```javascript
frame.fit(FitOptions.FILL_PROPORTIONALLY);
```

### Async/Await

UXP uses modern async/await:
```javascript
async function generateDocuments(params) {
    const doc = await app.open(templateFile);
    await frame.place(imageFile);
    await doc.save(outputFile);
}
```

## Debugging

1. **Open Chrome DevTools:**
   - In InDesign: Plugins > Development > Developer Console
   - Or use UXP Developer Tool

2. **Check console** for errors

3. **Use console.log()** for debugging:
   ```javascript
   console.log("Processing image:", imageFile.name);
   ```

## Requirements

- InDesign 2023 (v18.0) or later
- UXP API version 5 or later
- macOS or Windows

## Known Issues

1. **File dialog** - UXP file picker works differently than CEP
2. **Permissions** - Requires `fs` permission in manifest
3. **Async operations** - All file operations must use async/await

## Migration from CEP

If you have a CEP plugin:

1. ❌ Remove CSXS/, .debug files
2. ❌ Remove ExtendScript .jsx files
3. ✅ Create manifest.json (not manifest.xml)
4. ✅ Convert ExtendScript to InDesign DOM API
5. ✅ Use UXP file system API
6. ✅ Add async/await to all DOM operations

## Resources

- [UXP for Adobe InDesign](https://developer.adobe.com/indesign/uxp/)
- [UXP API Reference](https://developer.adobe.com/indesign/uxp/reference/)
- [InDesign DOM](https://developer.adobe.com/indesign/dom/api/)
- [UXP Developer Tool](https://developer.adobe.com/photoshop/uxp/devtool/)

## License

MIT
