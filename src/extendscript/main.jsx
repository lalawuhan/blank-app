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
                        // Found the frame!

                        // 1. Clear any existing content and place the new image
                        // The 'false' argument ensures the content is not replaced recursively
                        frame.place(imageFile, false);

                        // Only proceed if an image was actually placed
                        if (frame.allGraphics.length > 0) {
                            // 2. Set the frame's fitting properties for the "Smart" fit
                            
                            // Sets the default alignment for content within the frame to Center
                            frame.frameFittingOptions.fittingAlignment = AnchorPoint.CENTER_ANCHOR;
                            
                            // 3. Apply the proportional fit command (Fill Frame Proportionally)
                            // This resizes the image to fill the frame, cropping as necessary, and centers it.
                            frame.fit(FitOptions.proportionalFill); 

                            // ALTERNATE: If you want to show the whole image without cropping:
                            // frame.fit(FitOptions.PROPORTIONALLY);
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