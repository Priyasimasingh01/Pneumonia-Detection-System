// new updation with medical theme--(Rohan)
import React, { useState } from 'react';
import axios from 'axios';
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
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://localhost:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Artificial delay for better UX (optional, remove if unwanted)
      setTimeout(() => {
        setData(res.data);
        setIsLoading(false);
      }, 500);
      
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the analysis engine. Please try again.");
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
        {/* Header Section */}
        <div className="header-section">
          <h1>Pneumonia Detection System</h1>
          <p className="subtitle">AI-Powered Chest X-Ray Analysis</p>
        </div>
        
        {/* Upload Section */}
        <div className="upload-section">
          {!preview && (
            <div className="dropzone">
              <label htmlFor="file-upload" className="custom-file-upload">
                <div className="upload-icon">📁</div>
                <div>Click here to upload X-Ray Image</div>
                <div style={{fontSize: '0.8rem', marginTop: '10px', color: '#999'}}>
                  Supported formats: JPG, PNG, JPEG
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
              </div>
              
              {!data && !isLoading && (
                <div className="button-group">
                  <button className="btn predict-btn" onClick={sendFile}>
                    Analyze Image
                  </button>
                  <button className="btn clear-btn" onClick={clearData}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loader-container">
            <div className="pulse-ring"></div>
            <p>Scanning image for anomalies...</p>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="error-message">⚠️ {error}</div>}

        {/* Results Section */}
        {data && (
          <div className={`result-card ${data.class.toLowerCase() === 'pneumonia' ? 'pneumonia-border' : 'normal-border'}`}>
            <div className="result-header">
              <h2>Analysis Report</h2>
            </div>
            
            <div className="result-content">
              <div className="prediction-box">
                <span className="label">Diagnosis</span>
                <span className={`value ${data.class.toLowerCase()}`}>
                  {data.class}
                </span>
              </div>
              
              <div className="confidence-box">
                <span className="label">Confidence</span>
                <span className="value">
                  {data.confidence}%
                </span>
              </div>
            </div>

            <button className="btn clear-btn" style={{width: '100%'}} onClick={clearData}>
              Upload New X-Ray
            </button>
          </div>
        )}

        {/* Footer / Credits */}
        <div className="footer">
          <div className="designed-by">
            System designed by Priya <span className="heart-beat">❤</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;