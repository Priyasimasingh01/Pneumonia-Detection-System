// new medical theme.....(Rohan)
import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import doctorAnimation from './DoctorAnimation.json'; // Make sure filename matches
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      setPreview(null);
      setData(null);
      return;
    }
    const file = e.target.files[0];
    setSelectedFile(file);
    setData(null);
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const sendFile = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    setData(null);
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("https://pneumonia-detection-system-p3no.onrender.com", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setTimeout(() => {
        setData(res.data);
        setIsLoading(false);
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setError("System Error: Unable to connect to neural network.");
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
    setError(null);
  };

  return (
    <div className="App">
      <div className="container">
        
        {/* Header Section with Lottie Animation */}
        <div className="header-grid">
          <div className="lottie-wrapper">
             <Lottie animationData={doctorAnimation} loop={true} />
          </div>
          <div className="header-text">
            <h1>Pneumonia Detection</h1>
            <div className="subtitle">
              <span>AI DIAGNOSTIC TOOL</span>
              <span className="separator">|</span>
              <span>V 2.0</span>
            </div>
          </div>
        </div>
        
        {/* Upload Section */}
        <div className="upload-section">
          {!preview && (
            <div className="dropzone">
              <label htmlFor="file-upload" className="custom-file-upload">
                <div className="upload-icon">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="upload-text">INITIALIZE SCAN SEQUENCE</div>
                <div className="upload-hint">
                  UPLOAD DICOM / JPG / PNG
                </div>
              </label>
              <input 
                id="file-upload" 
                type="file" 
                onChange={onSelectFile} 
                accept="image/*"
              />
            </div>
          )}

          {preview && (
            <div className="preview-container">
              <div className="image-wrapper">
                <img src={preview} alt="X-ray preview" className="image-preview" />
                {isLoading && <div className="scanner-overlay"></div>}
              </div>
              
              {!isLoading && !data && (
                <div className="button-group">
                  <button className="btn predict-btn" onClick={sendFile}>
                    [ EXECUTE ANALYSIS ]
                  </button>
                  <button className="btn clear-btn" onClick={clearData}>
                    CANCEL
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State Text */}
        {isLoading && (
          <div className="loader-container">
            <p className="blinking-text">PROCESSING NEURAL LAYERS...</p>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="error-message">⚠ {error}</div>}

        {/* Results Section */}
        {data && (
          <div className={`result-card ${data.class.toLowerCase() === 'pneumonia' ? 'pneumonia-border' : 'normal-border'}`}>
            <div className="result-header">
              <h2>Diagnostic Report</h2>
            </div>
            
            <div className="result-content">
              <div className="prediction-box">
                <span className="label">Detected Class</span>
                <span className={`value ${data.class.toLowerCase()}`}>
                  {data.class}
                </span>
              </div>
              
              <div className="confidence-box">
                <span className="label">Confidence Level</span>
                <span className="value">
                  {data.confidence}%
                </span>
              </div>
            </div>

            <button className="btn clear-btn full-width" onClick={clearData}>
              START NEW SESSION
            </button>
          </div>
        )}

        {/* Footer / Credits */}
        <div className="footer">
          <div className="designed-by">
            System designed by Priya 
            <span className="tech-icon">❤</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;