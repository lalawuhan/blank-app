/**
 * @file index.js
 * Main UI script for the UXP Document Generator plugin
 */

const fs = require('uxp').storage.localFileSystem;
const { generateDocuments, exportDocument } = require('./indesign-logic.js');

// State
let imagesFolder = null;
let outputFolder = null;
let exportFolder = null;

// UI Elements
const selectImagesBtn = document.getElementById('selectImagesBtn');
const selectOutputBtn = document.getElementById('selectOutputBtn');
const selectExportBtn = document.getElementById('selectExportBtn');
const generateBtn = document.getElementById('generateBtn');
const exportBtn = document.getElementById('exportBtn');

const imagesFolderName = document.getElementById('imagesFolderName');
const outputFolderName = document.getElementById('outputFolderName');
const exportFolderName = document.getElementById('exportFolderName');
const statusContainer = document.getElementById('statusContainer');

// Folder selection handlers
selectImagesBtn.addEventListener('click', async () => {
    try {
        imagesFolder = await fs.getFolder();
        if (imagesFolder) {
            imagesFolderName.textContent = imagesFolder.name;
            showStatus('success', 'Images folder selected');
        }
    } catch (error) {
        showStatus('error', 'Error selecting images folder: ' + error.message);
    }
});

selectOutputBtn.addEventListener('click', async () => {
    try {
        outputFolder = await fs.getFolder();
        if (outputFolder) {
            outputFolderName.textContent = outputFolder.name;
            showStatus('success', 'Output folder selected');
        }
    } catch (error) {
        showStatus('error', 'Error selecting output folder: ' + error.message);
    }
});

selectExportBtn.addEventListener('click', async () => {
    try {
        exportFolder = await fs.getFolder();
        if (exportFolder) {
            exportFolderName.textContent = exportFolder.name;
            showStatus('success', 'Export folder selected');
        }
    } catch (error) {
        showStatus('error', 'Error selecting export folder: ' + error.message);
    }
});

// Generate documents handler
generateBtn.addEventListener('click', async () => {
    if (!imagesFolder) {
        showStatus('error', 'Please select an images folder');
        return;
    }
    if (!outputFolder) {
        showStatus('error', 'Please select an output folder');
        return;
    }

    try {
        generateBtn.disabled = true;
        showStatus('loading', 'Generating documents... This may take a few minutes.');

        // Get all image files from the folder
        const imageFiles = await getImageFiles(imagesFolder);

        if (imageFiles.length === 0) {
            showStatus('error', 'No image files found in the selected folder');
            generateBtn.disabled = false;
            return;
        }

        // Call the InDesign logic
        const result = await generateDocuments({
            imageFiles: imageFiles,
            outputFolder: outputFolder
        });

        if (result.success) {
            showStatus(
                'success',
                `✓ ${result.message}\n\nProcessed: ${result.processedCount} of ${result.totalImages} images`
            );
        } else {
            showStatus('error', result.message);
        }

    } catch (error) {
        showStatus('error', 'Error generating documents: ' + error.message);
    } finally {
        generateBtn.disabled = false;
    }
});

// Export document handler
exportBtn.addEventListener('click', async () => {
    if (!exportFolder) {
        showStatus('error', 'Please select an export folder');
        return;
    }

    try {
        exportBtn.disabled = true;
        showStatus('loading', 'Exporting document...');

        const result = await exportDocument({
            outputFolder: exportFolder
        });

        if (result.success) {
            showStatus(
                'success',
                `✓ ${result.message}\n\nPDF: ${result.pdfPath}\nPNGs: ${result.pngFolder}`
            );
        } else {
            showStatus('error', result.message);
        }

    } catch (error) {
        showStatus('error', 'Error exporting document: ' + error.message);
    } finally {
        exportBtn.disabled = false;
    }
});

/**
 * Get all image files from a folder
 * @param {Folder} folder - UXP Folder object
 * @returns {Array<File>} Array of image files
 */
async function getImageFiles(folder) {
    const entries = await folder.getEntries();
    const imageExtensions = /\.(jpg|jpeg|png|tif|tiff|psd|ai|pdf)$/i;

    const imageFiles = [];
    for (const entry of entries) {
        if (entry.isFile && imageExtensions.test(entry.name)) {
            imageFiles.push(entry);
        }
    }

    // Sort by name
    imageFiles.sort((a, b) => a.name.localeCompare(b.name));

    return imageFiles;
}

/**
 * Show status message
 * @param {String} type - 'success', 'error', or 'loading'
 * @param {String} message - Message to display
 */
function showStatus(type, message) {
    statusContainer.innerHTML = `
        <div class="status status-${type}">
            <pre>${message}</pre>
        </div>
    `;
}
