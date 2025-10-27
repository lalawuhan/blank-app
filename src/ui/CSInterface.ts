/**
 * CSInterface - Communication bridge between CEP panel and ExtendScript
 * This is a simplified version of Adobe's CSInterface library
 */

class CSInterface {
  /**
   * Evaluate an ExtendScript
   * @param script The ExtendScript string to evaluate
   * @param callback Optional callback function
   */
  evalScript(script: string, callback?: (result: string) => void): void {
    if (callback === null || callback === undefined) {
      callback = function (result: string) {
        // Default empty callback
      };
    }

    // Check if we're running in a CEP environment
    if (window.__adobe_cep__) {
      window.__adobe_cep__.evalScript(script, callback);
    } else {
      // For development/testing outside of InDesign
      console.log('CSInterface.evalScript called (not in CEP environment):', script);
      callback('{"success": false, "message": "Not running in CEP environment"}');
    }
  }

  /**
   * Get the path of the extension
   */
  getSystemPath(pathType: string): string {
    if (window.__adobe_cep__) {
      return window.__adobe_cep__.getSystemPath(pathType);
    }
    return '';
  }

  /**
   * Open a URL in the default browser
   */
  openURLInDefaultBrowser(url: string): void {
    if (window.__adobe_cep__) {
      window.__adobe_cep__.openURLInDefaultBrowser(url);
    } else {
      window.open(url, '_blank');
    }
  }
}

// Extend the Window interface to include CEP-specific properties
declare global {
  interface Window {
    __adobe_cep__?: {
      evalScript: (script: string, callback: (result: string) => void) => void;
      getSystemPath: (pathType: string) => string;
      openURLInDefaultBrowser: (url: string) => void;
    };
  }
}

export default CSInterface;
