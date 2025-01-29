import React, { useState } from 'react';
import axios from 'axios';
import './LintAnalysis.css';

const LintAnalysis = () => {
  const [path, setPath] = useState('');
  const [reportUrl, setReportUrl] = useState(null);
  const [remediationAdvice, setRemediationAdvice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePathChange = (event) => {
    setPath(event.target.value);
  };

  const handleLint = async (analysisType) => {
    if (!path) {
      alert('Please enter a valid path!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/run-lint', {
        path: path,
        analysisType: analysisType,
      });

      if (response.data) {
        setReportUrl('http://localhost:4000/reports/lint-report.html');
        setRemediationAdvice(response.data.remediation_advice); // Store remediation advice
        setError(null);
      } else {
        setReportUrl(null);
        setRemediationAdvice(null);
        setError('No report generated or report is empty');
      }
    } catch (error) {
      setReportUrl(null);
      setRemediationAdvice(null);
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const openReportInNewTab = () => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
    } else {
      alert('No report available to view.');
    }
  };

  return (
    <div className="lint-analysis-container">
      <h1 className="title">Android Lint Analysis</h1>

      <div className="input-container">
        <input
          type="text"
          value={path}
          onChange={handlePathChange}
          placeholder="Enter the path to analyze..."
          className="path-input"
        />
        <button className="analyze-button" onClick={() => handleLint('basic')}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {loading && <p className="loading-text">Running Analysis...</p>}

      {reportUrl && (
        <div className="report-container">
          <h3 className="report-title">Lint Report</h3>
          <button className="view-report-button" onClick={openReportInNewTab}>
            View Report
          </button>
        </div>
      )}

      {remediationAdvice && (
        <div className="remediation-advice-container">
          <h3 className="advice-title">Remediation Advice</h3>
          <pre className="advice-text">{remediationAdvice}</pre>
        </div>
      )}

      {error && <pre className="error-text">Error: {error}</pre>}
    </div>
  );
};

export default LintAnalysis;
