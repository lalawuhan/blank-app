# InDesign Document Generator

A powerful InDesign CEP plugin that automates the creation of multiple document copies with different background images. Perfect for creating table numbers, place cards, or any design that requires multiple variations with different artwork.

## Features

- **Batch Document Generation**: Automatically create multiple InDesign documents from a single template
- **Parent Page Integration**: Updates images on Parent Pages (Master Pages) to affect all document pages simultaneously
- **Template Selection**: Choose any InDesign template file (.indd or .indt)
- **Flexible Image Support**: Works with JPG, PNG, TIFF, PSD, AI, and PDF files
- **PDF & PNG Export**: Export active documents to high-resolution PDF and PNG files
- **Smart Image Fitting**: Automatically fits and centers images proportionally

## Workflow

### 1. Generate Documents
The plugin creates multiple complete documents by:
1. Opening a fresh copy of your template for each image
2. Finding the frame labeled "ImageFrame" on the Parent Page
3. Placing a unique background image in that frame
4. Applying proper fitting and centering
5. Saving the document with a descriptive name

### 2. Export Documents
A secondary utility to export the active document:
- Exports the entire document as a PDF
- Creates individual PNG files for each page (300 DPI)
- Organizes PNGs in a dedicated subfolder

## Prerequisites

- Adobe InDesign CC 2018 or later
- Node.js (for building the plugin)

## Installation

### Step 1: Build the Plugin

```bash
# Install dependencies
npm install

# Build the plugin
npm run build
```

### Step 2: Install in InDesign

Copy the `dist` folder to your CEP extensions directory:

**macOS:**
```bash
cp -r dist ~/Library/Application\ Support/Adobe/CEP/extensions/com.indesign.documentgenerator
```

**Windows:**
```cmd
xcopy /E /I dist "%APPDATA%\Adobe\CEP\extensions\com.indesign.documentgenerator"
```

### Step 3: Enable Debug Mode (Development Only)

For unsigned extensions, you need to enable debug mode:

**macOS:**
```bash
defaults write com.adobe.CSXS.9 PlayerDebugMode 1
```

**Windows:**
Create a registry key at:
```
HKEY_CURRENT_USER\Software\Adobe\CSXS.9
```
Add a new String Value: `PlayerDebugMode` with value `1`

*Note: Replace `9` with your CEP version number (8, 9, 10, 11, etc.)*

### Step 4: Launch InDesign

1. Restart InDesign
2. Go to **Window > Extensions > Document Generator**

## Usage

### Template Setup

Your InDesign template **must** have a frame labeled `ImageFrame` on a Parent Page (Master Page):

1. Open your template in InDesign
2. Go to the Parent Pages panel
3. Select the frame where you want background images to appear
4. Open Window > Utilities > Script Label
5. Enter `ImageFrame` as the script label
6. Save your template

### Generating Documents

1. **Choose Template**: Select your prepared InDesign template file
2. **Choose Images Folder**: Select the folder containing your background images
3. **Choose Output Folder**: Select where to save the generated documents
4. **Generate**: Click "Generate All Documents"

The plugin will:
- Process each image in alphabetical order
- Create one complete document per image
- Name each document based on the image filename
- Save all documents to your output folder

### Exporting Documents

1. Open any generated document in InDesign
2. In the plugin, select an export folder
3. Click "Export PDF & PNGs"

The plugin will create:
- A single PDF of all pages
- A subfolder with high-resolution PNG files (one per page)

## File Structure

```
indesign-document-generator/
├── src/
│   ├── extendscript/          # InDesign automation scripts
│   │   ├── main.jsx           # Main ExtendScript logic
│   │   └── json2.js           # JSON utility
│   └── ui/                    # React UI components
│       ├── index.html
│       ├── index.tsx
│       ├── App.tsx            # Main React component
│       ├── App.css
│       └── CSInterface.ts     # CEP communication layer
├── CSXS/
│   └── manifest.xml           # Plugin manifest
├── .debug                     # Debug configuration
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## Development

### Watch Mode

For active development with auto-rebuild:

```bash
npm run dev
```

### Building

```bash
npm run build
```

### Packaging

```bash
npm run package
```

## Troubleshooting

### Plugin Doesn't Appear in InDesign

1. Verify the extension is in the correct CEP folder
2. Check that debug mode is enabled
3. Ensure the folder name matches the extension ID: `com.indesign.documentgenerator`
4. Restart InDesign completely

### "ImageFrame not found" Error

1. Open your template in InDesign
2. Go to the Parent Pages (Master Pages) panel
3. Select the frame that should hold the background
4. Set its Script Label to `ImageFrame`
5. Save the template and try again

### Images Not Fitting Properly

The plugin uses `FitOptions.PROPORTIONALLY` and centers the image. If images still don't fit correctly:
1. Check that your ImageFrame has the correct dimensions
2. Ensure images are high enough resolution
3. Verify the frame is not inside a nested group (or update the script label on the correct frame)

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Technical Details

### ExtendScript Functions

- `generateDocuments(params)` - Main loop to create multiple documents
- `updateParentPageImage(doc, imageFile)` - Updates the ImageFrame on Parent Page
- `exportDocument(params)` - Exports PDF and PNGs
- `selectFolder(prompt)` - Opens folder selection dialog
- `selectFile(prompt, filter)` - Opens file selection dialog

### React Components

- `App.tsx` - Main UI component with all controls
- `CSInterface.ts` - Communication bridge between React and ExtendScript

### CEP Version Support

This plugin is built for CEP 9.0+ which supports:
- InDesign CC 2018 and later
- Modern JavaScript (ES6+)
- React 18

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue on the project repository.

## Credits

Built with:
- [Adobe CEP](https://github.com/Adobe-CEP/CEP-Resources)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Webpack](https://webpack.js.org/)

---

**Happy Designing! 🎨**
