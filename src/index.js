import React ,{useState}from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import axios from 'axios';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
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

  return (
    <div className="container">
      <h2 className="title">Android Manifest Analysis</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button type="submit" className="submit-button">Analyze</button>
      </form>
      {error && <p className="error">{error}</p>}
      {results && (
        <div className="results">
          <h3 className="results-title">Analysis Results:</h3>
          <div className="manifest-analysis">
            <h4>Manifest Analysis</h4>
            <div className="section">
              <h5>Exported Components:</h5>
              <ul>
                {results.manifest_analysis.exported_components.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="section">
              <h5>Findings:</h5>
              <pre>{JSON.stringify(results.manifest_analysis.findings, null, 2)}</pre>
            </div>
            <div className="section">
              <h5>Insecure API Usage:</h5>
              <pre>{JSON.stringify(results.manifest_analysis.insecure_api_usage, null, 2)}</pre>
            </div>
            <div className="section">
              <h5>Overprivileged Permissions:</h5>
              <pre>{JSON.stringify(results.manifest_analysis.overprivileged_permissions, null, 2)}</pre>
            </div>
            <div className="section">
              <h5>Potential Injection Points:</h5>
              <pre>{JSON.stringify(results.manifest_analysis.potential_injection_points, null, 2)}</pre>
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
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
