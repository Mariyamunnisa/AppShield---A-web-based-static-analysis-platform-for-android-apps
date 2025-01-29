import React, { useState } from 'react';
import axios from 'axios';
import './AndroidManifestAnalysis.css'; // Import the CSS file for styling

const AndroidManifestAnalysis = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/analyze_apk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        setResults(response.data);
        setError('');
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      setError('Error analyzing APK: ' + err.message);
      setResults(null);
    }
  };

  const renderInjectionPoints = (points) => {
    return points.map((point, index) => (
      <li key={index}>
        <strong>Component:</strong> {point.component}
        <ul>
          <li><strong>Action:</strong> {point.action}</li>
          <li><strong>Categories:</strong> {point.categories.join(', ')}</li>
          <li><strong>Data:</strong>
            <ul>
              {point.data.map((data, dataIndex) => (
                <li key={dataIndex}>
                  {Object.entries(data).map(([key, value]) => (
                    <span key={key}><strong>{key}:</strong> {value} </span>
                  ))}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </li>
    ));
  };

  return (
    <div className="container">
      <h2>Android Manifest Analysis</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Analyze</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {results && (
        <div className="results">
          <h3>Analysis Results:</h3>
          <div className="analysis-results">
            <h4>Manifest Analysis</h4>
            <div>
              <strong>Exported Components:</strong>
              <ul>
                {results.manifest_analysis.exported_components.map((component, index) => (
                  <li key={index}>{component}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Findings:</strong>
              <ul>
                {results.manifest_analysis.findings.map((finding, index) => (
                  <li key={index}>
                    <strong>{finding[0]}:</strong>
                    <ul>
                      {finding[1].map((item, subIndex) => (
                        <li key={subIndex}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Insecure API Usage:</strong>
              <ul>
                {results.manifest_analysis.insecure_api_usage.map((usage, index) => (
                  <li key={index}>{usage}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Overprivileged Permissions:</strong>
              <ul>
                {results.manifest_analysis.overprivileged_permissions.map((permission, index) => (
                  <li key={index}>{permission}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Potential Injection Points:</strong>
              <ul>
                {renderInjectionPoints(results.manifest_analysis.potential_injection_points)}
              </ul>
            </div>
          </div>
          <div className="remediation-advice">
            <h4>Remediation Advice:</h4>
            <pre>{results.remediation_advice}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AndroidManifestAnalysis;
