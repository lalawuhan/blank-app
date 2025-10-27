// InDesign Document Generator - Main ExtendScript
// This file contains all the automation logic for creating and exporting documents

#target "indesign"
#include "json2.js"

/**
 * Main function to generate 30 documents from a template
 * @param {Object} params - Contains templatePath, imageFolder, and outputFolder
 * @returns {String} JSON string with success status and message
 */
function generateDocuments(params) {
    try {
        var templatePath = params.templatePath;
        var imageFolder = new Folder(params.imageFolder);
        var outputFolder = new Folder(params.outputFolder);

        // Validate inputs
        if (!File(templatePath).exists) {
            return JSON.stringify({
                success: false,
                message: "Template file not found: " + templatePath
            });
        }

        if (!imageFolder.exists) {
            return JSON.stringify({
                success: false,
                message: "Image folder not found: " + params.imageFolder
            });
        }

        // Create output folder if it doesn't exist
        if (!outputFolder.exists) {
            outputFolder.create();
        }

        // Get all image files from the folder
        var imageFiles = getImageFiles(imageFolder);

        if (imageFiles.length === 0) {
            return JSON.stringify({
                success: false,
                message: "No image files found in the selected folder"
            });
        }

        // Sort image files by name
        imageFiles.sort(function(a, b) {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        });

        var processedCount = 0;
        var errors = [];

        // Loop through each image file and create a document
        for (var i = 0; i < imageFiles.length; i++) {
            try {
                var imageFile = imageFiles[i];
                var imageName = imageFile.name.replace(/\.[^\.]+$/, ''); // Remove extension

                // Open a fresh copy of the template
                var doc = app.open(File(templatePath), false);

                // Find and update the ImageFrame on the parent page
                var updated = updateParentPageImage(doc, imageFile);

                if (!updated) {
                    errors.push("Could not find ImageFrame in document for: " + imageName);
                    doc.close(SaveOptions.NO);
                    continue;
                }

                // Save the document with the image name
                var outputFile = new File(outputFolder.fsName + "/" + imageName + ".indd");
                doc.save(outputFile);
                doc.close(SaveOptions.NO);

                processedCount++;

            } catch (docError) {
                errors.push("Error processing " + imageFiles[i].name + ": " + docError.message);
            }
        }

        var message = "Successfully created " + processedCount + " documents";
        if (errors.length > 0) {
            message += "\n\nErrors encountered:\n" + errors.join("\n");
        }

        return JSON.stringify({
            success: true,
            message: message,
            processedCount: processedCount,
            totalImages: imageFiles.length
        });

    } catch (error) {
        return JSON.stringify({
            success: false,
            message: "Error: " + error.message + " (Line: " + error.line + ")"
        });
    }
}

/**
 * Update the ImageFrame on the parent page with a new image
 * @param {Document} doc - The InDesign document
 * @param {File} imageFile - The image file to place
 * @returns {Boolean} Success status
 */
function updateParentPageImage(doc, imageFile) {
    try {
        // Search through all master spreads (parent pages)
        for (var i = 0; i < doc.masterSpreads.length; i++) {
            var masterSpread = doc.masterSpreads[i];

            // Search through all page items on each page of the master spread
            for (var j = 0; j < masterSpread.pages.length; j++) {
                var page = masterSpread.pages[j];

                // Look for a rectangle with the script label "ImageFrame"
                for (var k = 0; k < page.rectangles.length; k++) {
                    var frame = page.rectangles[k];

                    if (frame.label === "ImageFrame" || frame.label === "imageframe") {
                        // Found the frame! Place the image
                        frame.place(imageFile, false);

                        // Fit the image proportionally to fill the frame
                        if (frame.allGraphics.length > 0) {
                            var graphic = frame.allGraphics[0];
                            frame.fit(FitOptions.PROPORTIONALLY);

                            // Center the content
                            frame.frameFittingOptions.fittingOnEmptyFrame = FittingOptions.FILL_PROPORTIONALLY;
                            frame.frameFittingOptions.fittingAlignment = AnchorPoint.CENTER_ANCHOR;
                            frame.fit(FitOptions.FRAME_TO_CONTENT);
                            frame.fit(FitOptions.CONTENT_TO_FRAME);
                        }

                        return true;
                    }
                }

                // Also check in groups
                for (var g = 0; g < page.groups.length; g++) {
                    var found = findAndUpdateImageFrameInGroup(page.groups[g], imageFile);
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
 * Recursively search for ImageFrame in groups
 * @param {Group} group - The group to search
 * @param {File} imageFile - The image file to place
 * @returns {Boolean} Success status
 */
function findAndUpdateImageFrameInGroup(group, imageFile) {
    // Check rectangles in this group
    for (var i = 0; i < group.rectangles.length; i++) {
        var frame = group.rectangles[i];
        if (frame.label === "ImageFrame" || frame.label === "imageframe") {
            frame.place(imageFile, false);
            if (frame.allGraphics.length > 0) {
                frame.fit(FitOptions.PROPORTIONALLY);
                frame.frameFittingOptions.fittingOnEmptyFrame = FittingOptions.FILL_PROPORTIONALLY;
                frame.frameFittingOptions.fittingAlignment = AnchorPoint.CENTER_ANCHOR;
                frame.fit(FitOptions.FRAME_TO_CONTENT);
                frame.fit(FitOptions.CONTENT_TO_FRAME);
            }
            return true;
        }
    }

    // Recursively check nested groups
    for (var j = 0; j < group.groups.length; j++) {
        var found = findAndUpdateImageFrameInGroup(group.groups[j], imageFile);
        if (found) return true;
    }

    return false;
}

/**
 * Get all image files from a folder
 * @param {Folder} folder - The folder to search
 * @returns {Array} Array of image files
 */
function getImageFiles(folder) {
    var imageExtensions = /\.(jpg|jpeg|png|tif|tiff|psd|ai|pdf)$/i;
    var files = folder.getFiles();
    var imageFiles = [];

    for (var i = 0; i < files.length; i++) {
        if (files[i] instanceof File && imageExtensions.test(files[i].name)) {
            imageFiles.push(files[i]);
        }
    }

    return imageFiles;
}

/**
 * Export the active document to PDF and PNG
 * @param {Object} params - Contains outputFolder
 * @returns {String} JSON string with success status and message
 */
function exportDocument(params) {
    try {
        if (app.documents.length === 0) {
            return JSON.stringify({
                success: false,
                message: "No active document to export"
            });
        }

        var doc = app.activeDocument;
        var outputFolder = new Folder(params.outputFolder);

        // Create output folder if it doesn't exist
        if (!outputFolder.exists) {
            outputFolder.create();
        }

        // Get document name without extension
        var docName = doc.name.replace(/\.[^\.]+$/, '');

        // Create subfolder for PNGs
        var pngFolder = new Folder(outputFolder.fsName + "/" + docName + "_PNGs");
        if (!pngFolder.exists) {
            pngFolder.create();
        }

        // Export PDF
        var pdfFile = new File(outputFolder.fsName + "/" + docName + ".pdf");
        doc.exportFile(ExportFormat.PDF_TYPE, pdfFile, false);

        // Export each page as PNG
        var pngExportPreset = app.pngExportPreferences;
        pngExportPreset.exportResolution = 300; // High resolution
        pngExportPreset.exportingSpread = false;

        for (var i = 0; i < doc.pages.length; i++) {
            var page = doc.pages[i];
            var pageNum = i + 1;
            var pngFile = new File(pngFolder.fsName + "/" + docName + "_Page_" + padZero(pageNum, 2) + ".png");

            // Set page range for this specific page
            app.pngExportPreferences.pageString = page.name;

            doc.exportFile(ExportFormat.PNG_FORMAT, pngFile, false);
        }

        return JSON.stringify({
            success: true,
            message: "Exported PDF and " + doc.pages.length + " PNG files successfully",
            pdfPath: pdfFile.fsName,
            pngFolder: pngFolder.fsName
        });

    } catch (error) {
        return JSON.stringify({
            success: false,
            message: "Export error: " + error.message + " (Line: " + error.line + ")"
        });
    }
}

/**
 * Pad a number with leading zeros
 * @param {Number} num - The number to pad
 * @param {Number} size - The desired string length
 * @returns {String} Padded number string
 */
function padZero(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

/**
 * Select a folder using the system dialog
 * @param {String} prompt - The dialog prompt
 * @returns {String} JSON string with selected folder path or error
 */
function selectFolder(prompt) {
    try {
        var folder = Folder.selectDialog(prompt);
        if (folder) {
            return JSON.stringify({
                success: true,
                path: folder.fsName
            });
        } else {
            return JSON.stringify({
                success: false,
                message: "No folder selected"
            });
        }
    } catch (e) {
        return JSON.stringify({
            success: false,
            message: "Error: " + e.message
        });
    }
}

/**
 * Select a file using the system dialog
 * @param {String} prompt - The dialog prompt
 * @param {String} filter - File filter (e.g., "*.indd" or function)
 * @returns {String} JSON string with selected file path or error
 */
function selectFile(prompt, filter) {
    try {
        // File.openDialog on Mac and Windows
        // Filter can be a string on Windows ("*.indd") or a function
        var file;

        if (filter && filter !== "") {
            // For InDesign files, we'll use a function filter that works cross-platform
            file = File.openDialog(prompt, function(f) {
                if (f instanceof Folder) return true;
                var name = f.name.toLowerCase();
                return name.indexOf('.indd') > -1 || name.indexOf('.indt') > -1;
            });
        } else {
            file = File.openDialog(prompt);
        }

        if (file) {
            return JSON.stringify({
                success: true,
                path: file.fsName
            });
        } else {
            return JSON.stringify({
                success: false,
                message: "No file selected"
            });
        }
    } catch (e) {
        return JSON.stringify({
            success: false,
            message: "Error: " + e.message
        });
    }
}
