/**
 * @file indesign-logic.js
 * Contains all InDesign DOM automation logic for the UXP plugin.
 */

const { app, FitOptions, AnchorPoint, ExportFormat, SaveOptions } = require("indesign");
const fs = require('uxp').storage.localFileSystem;

/**
 * Main function to generate multiple documents from the active document.
 * @param {Object} params - Contains imageFiles (Array) and outputFolder (Folder)
 * @returns {Object} { success: Boolean, message: String, processedCount: Number, totalImages: Number }
 */
async function generateDocuments(params) {
    let result = { success: false, message: "", processedCount: 0, totalImages: 0 };

    try {
        // 1. Check if there's an active document
        if (app.documents.length === 0) {
            result.message = "Please open your template document in InDesign first.";
            return result;
        }

        const activeDoc = app.activeDocument;

        // 2. Check if document is saved
        if (!activeDoc.saved || !activeDoc.fullName) {
            result.message = "Please save your template document before generating copies.";
            return result;
        }

        const templateFile = activeDoc.fullName;

        if (!params.imageFiles || params.imageFiles.length === 0) {
            result.message = "No image files were provided.";
            return result;
        }

        const imageFiles = params.imageFiles;
        const outputFolder = params.outputFolder;
        result.totalImages = imageFiles.length;
        let errors = [];

        // 3. Loop through each image file and create a document
        for (let i = 0; i < imageFiles.length; i++) {
            try {
                const imageFile = imageFiles[i];
                const imageName = imageFile.name.replace(/\.[^\.]+$/, '');

                // Open a fresh copy of the template
                const doc = await app.open(templateFile, false);

                // Find and update the ImageFrame on the parent page
                const updated = await updateParentPageImage(doc, imageFile);

                if (!updated) {
                    errors.push(`Could not find ImageFrame in document for: ${imageName}`);
                    doc.close(SaveOptions.NO);
                    continue;
                }

                // Save the document with the image name
                const outputFile = await outputFolder.createFile(`${imageName}.indd`, { overwrite: true });
                await doc.save(outputFile);
                doc.close(SaveOptions.NO);

                result.processedCount++;

            } catch (docError) {
                errors.push(`Error processing ${imageFiles[i].name}: ${docError.message}`);
            }
        }

        result.success = true;
        result.message = `Successfully created ${result.processedCount} documents`;
        if (errors.length > 0) {
            result.message += `\n\nErrors encountered:\n${errors.join("\n")}`;
        }
        return result;

    } catch (error) {
        result.message = `Core Automation Error: ${error.message}`;
        return result;
    }
}

/**
 * Update the ImageFrame on the parent page with a new image
 * @param {Document} doc - The InDesign document
 * @param {File} imageFile - The UXP File object to place
 * @returns {Boolean} Success status
 */
async function updateParentPageImage(doc, imageFile) {
    try {
        // Search through all master spreads (parent pages)
        for (let i = 0; i < doc.masterSpreads.length; i++) {
            const masterSpread = doc.masterSpreads[i];

            // Search through all page items on each page of the master spread
            for (let j = 0; j < masterSpread.pages.length; j++) {
                const page = masterSpread.pages[j];

                // Look for a rectangle with the script label "ImageFrame"
                for (let k = 0; k < page.rectangles.length; k++) {
                    const frame = page.rectangles[k];

                    if (frame.label === "ImageFrame" || frame.label === "imageframe") {

                        // Place the new image
                        await frame.place(imageFile, false);

                        if (frame.allGraphics.length > 0) {
                            // Set the content alignment to Center
                            frame.frameFittingOptions.fittingAlignment = AnchorPoint.CENTER_ANCHOR;

                            // Apply proportional fill
                            frame.fit(FitOptions.FILL_PROPORTIONALLY);
                        }
                        return true;
                    }
                }

                // Recursively check groups
                for (let g = 0; g < page.groups.length; g++) {
                    const found = await findAndUpdateImageFrameInGroup(page.groups[g], imageFile);
                    if (found) return true;
                }
            }
        }

        return false;

    } catch (error) {
        throw new Error("updateParentPageImage: " + error.message);
    }
}

/**
 * Recursively search for ImageFrame in groups and apply image
 */
async function findAndUpdateImageFrameInGroup(group, imageFile) {
    // Check rectangles in this group
    for (let i = 0; i < group.rectangles.length; i++) {
        const frame = group.rectangles[i];
        if (frame.label === "ImageFrame" || frame.label === "imageframe") {
            await frame.place(imageFile, false);
            if (frame.allGraphics.length > 0) {
                frame.frameFittingOptions.fittingAlignment = AnchorPoint.CENTER_ANCHOR;
                frame.fit(FitOptions.FILL_PROPORTIONALLY);
            }
            return true;
        }
    }

    // Recursively check nested groups
    for (let j = 0; j < group.groups.length; j++) {
        const found = await findAndUpdateImageFrameInGroup(group.groups[j], imageFile);
        if (found) return true;
    }

    return false;
}

/**
 * Export the active document to PDF and PNG.
 * @param {Object} params - Contains outputFolder (Folder)
 * @returns {Object} Export details
 */
async function exportDocument(params) {
    let result = { success: false, message: "", pdfPath: "", pngFolder: "" };

    try {
        if (app.documents.length === 0) {
            result.message = "No active document to export.";
            return result;
        }

        const doc = app.activeDocument;
        const outputFolder = params.outputFolder;

        const docName = doc.name.replace(/\.[^\.]+$/, '');

        // Create subfolder for PNGs
        const pngFolderName = `${docName}_PNGs`;
        const pngFolder = await outputFolder.createFolder(pngFolderName);

        // Export PDF
        const pdfFile = await outputFolder.createFile(`${docName}.pdf`, { overwrite: true });
        await doc.exportFile(ExportFormat.PDF_TYPE, pdfFile, false);
        result.pdfPath = pdfFile.nativePath;

        // Export each page as PNG
        const pngExportPreset = app.pngExportPreferences;
        pngExportPreset.exportResolution = 300;
        pngExportPreset.exportingSpread = false;

        for (let i = 0; i < doc.pages.length; i++) {
            const page = doc.pages[i];
            const pageNum = i + 1;
            const pngFileName = `${docName}_Page_${padZero(pageNum, 2)}.png`;
            const pngFile = await pngFolder.createFile(pngFileName, { overwrite: true });

            pngExportPreset.pageString = page.name;
            await doc.exportFile(ExportFormat.PNG_FORMAT, pngFile, false);
        }

        result.success = true;
        result.message = `Exported PDF and ${doc.pages.length} PNG files successfully`;
        result.pngFolder = pngFolder.nativePath;
        return result;

    } catch (error) {
        result.message = `Export error: ${error.message}`;
        return result;
    }
}

/**
 * Pad a number with leading zeros
 */
function padZero(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

module.exports = {
    generateDocuments,
    exportDocument
};
