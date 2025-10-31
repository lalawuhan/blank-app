import React, { useState } from 'react';
import './App.css';
import CSInterface from './CSInterface';

const csInterface = new CSInterface();

interface Status {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

const App: React.FC = () => {
  const [imageFolder, setImageFolder] = useState<string>('');
  const [outputFolder, setOutputFolder] = useState<string>('');
  const [exportFolder, setExportFolder] = useState<string>('');
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' });

  const selectImageFolder = () => {
    const script = `selectFolder("Select Folder with Background Images")`;
    csInterface.evalScript(script, (result: string) => {
      try {
        const data = JSON.parse(result);
        if (data.success) {
          setImageFolder(data.path);
          setStatus({ type: 'success', message: 'Image folder selected' });
        } else {
          setStatus({ type: 'error', message: data.message || 'Failed to select folder' });
        }
      } catch (e) {
        setStatus({ type: 'error', message: 'Error selecting image folder' });
      }
    });
  };

  const selectOutputFolder = () => {
    const script = `selectFolder("Select Output Folder for Generated Documents")`;
    csInterface.evalScript(script, (result: string) => {
      try {
        const data = JSON.parse(result);
        if (data.success) {
          setOutputFolder(data.path);
          setStatus({ type: 'success', message: 'Output folder selected' });
        } else {
          setStatus({ type: 'error', message: data.message || 'Failed to select folder' });
        }
      } catch (e) {
        setStatus({ type: 'error', message: 'Error selecting output folder' });
      }
    });
  };

  const selectExportFolder = () => {
    const script = `selectFolder("Select Export Folder for PDF and PNGs")`;
    csInterface.evalScript(script, (result: string) => {
      try {
        const data = JSON.parse(result);
        if (data.success) {
          setExportFolder(data.path);
          setStatus({ type: 'success', message: 'Export folder selected' });
        } else {
          setStatus({ type: 'error', message: data.message || 'Failed to select folder' });
        }
      } catch (e) {
        setStatus({ type: 'error', message: 'Error selecting export folder' });
      }
    });
  };

  const generateDocuments = () => {
    if (!imageFolder) {
      setStatus({ type: 'error', message: 'Please select an image folder' });
      return;
    }
    if (!outputFolder) {
      setStatus({ type: 'error', message: 'Please select an output folder' });
      return;
    }

    setStatus({ type: 'loading', message: 'Generating documents... This may take a few minutes.' });

    const params = {
      imageFolder,
      outputFolder
    };

    const script = `generateDocuments(${JSON.stringify(params)})`;

    csInterface.evalScript(script, (result: string) => {
      try {
        const data = JSON.parse(result);
        if (data.success) {
          setStatus({
            type: 'success',
            message: `✓ ${data.message}\n\nProcessed: ${data.processedCount} of ${data.totalImages} images`
          });
        } else {
          setStatus({ type: 'error', message: data.message || 'Failed to generate documents' });
        }
      } catch (e) {
        setStatus({ type: 'error', message: 'Error generating documents: ' + e });
      }
    });
  };

  const exportActiveDocument = () => {
    if (!exportFolder) {
      setStatus({ type: 'error', message: 'Please select an export folder' });
      return;
    }

    setStatus({ type: 'loading', message: 'Exporting document...' });

    const params = {
      outputFolder: exportFolder
    };

    const script = `exportDocument(${JSON.stringify(params)})`;

    csInterface.evalScript(script, (result: string) => {
      try {
        const data = JSON.parse(result);
        if (data.success) {
          setStatus({
            type: 'success',
            message: `✓ ${data.message}\n\nPDF: ${data.pdfPath}\nPNGs: ${data.pngFolder}`
          });
        } else {
          setStatus({ type: 'error', message: data.message || 'Failed to export document' });
        }
      } catch (e) {
        setStatus({ type: 'error', message: 'Error exporting document: ' + e });
      }
    });
  };

  const getFolderName = (path: string) => {
    if (!path) return '';
    return path.split(/[\\/]/).pop() || path;
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Document Generator</h1>
        <p className="subtitle">Create multiple documents with different backgrounds</p>
      </div>

      <div className="content">
        {/* Important Note */}
        <div className="section" style={{backgroundColor: '#1f3a2a', borderColor: '#4caf50'}}>
          <h2 style={{color: '#81c784'}}>⚠️ Before You Start</h2>
          <p className="section-note" style={{color: '#b2dfb4', fontSize: '13px', margin: '8px 0'}}>
            1. Open your template document in InDesign<br/>
            2. Make sure it has a frame labeled "ImageFrame" on the Parent Page<br/>
            3. Use the plugin to generate copies with different backgrounds
          </p>
        </div>

        {/* SECTION 1: Generate Documents */}
        <div className="section">
          <h2>Generate Documents</h2>
          <p className="section-note">Creates multiple copies of the active document</p>

          <div className="input-group">
            <label>Images Folder:</label>
            <div className="file-input">
              <button onClick={selectImageFolder} className="btn-secondary">
                Choose Folder
              </button>
              <span className="file-name">
                {imageFolder ? getFolderName(imageFolder) : 'No folder selected'}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Output Folder:</label>
            <div className="file-input">
              <button onClick={selectOutputFolder} className="btn-secondary">
                Choose Folder
              </button>
              <span className="file-name">
                {outputFolder ? getFolderName(outputFolder) : 'No folder selected'}
              </span>
            </div>
          </div>

          <button
            onClick={generateDocuments}
            className="btn-primary"
            disabled={status.type === 'loading'}
          >
            {status.type === 'loading' ? 'Generating...' : 'Generate All Documents'}
          </button>
        </div>

        {/* SECTION 2: Export Active Document */}
        <div className="section">
          <h2>Export Active Document</h2>
          <p className="section-note">Export to PDF and PNG files</p>

          <div className="input-group">
            <label>Export Folder:</label>
            <div className="file-input">
              <button onClick={selectExportFolder} className="btn-secondary">
                Choose Folder
              </button>
              <span className="file-name">
                {exportFolder ? getFolderName(exportFolder) : 'No folder selected'}
              </span>
            </div>
          </div>

          <button
            onClick={exportActiveDocument}
            className="btn-primary"
            disabled={status.type === 'loading'}
          >
            {status.type === 'loading' ? 'Exporting...' : 'Export PDF & PNGs'}
          </button>
        </div>

        {/* Status Message */}
        {status.message && (
          <div className={`status status-${status.type}`}>
            <pre>{status.message}</pre>
          </div>
        )}
      </div>

      <div className="footer">
        <p className="help-text">
          <strong>Tip:</strong> Save your template before generating documents
        </p>
      </div>
    </div>
  );
};

export default App;
