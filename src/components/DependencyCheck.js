import React, { useState } from 'react';

const DependencyCheck = () => {
  const [sourceCodePath, setSourceCodePath] = useState('');
  const [reportUrl, setReportUrl] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source_code_path: sourceCodePath }),
      });

      if (response.ok) {
        // Create a URL for the report
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setReportUrl(url);
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error);
        setReportUrl(null);
      }

    } catch (err) {
      setError('Error connecting to the server.');
      setReportUrl(null);
    }
  };

  // Function to open the report in a new tab
  const openReportInNewTab = () => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
    } else {
      alert('No report available to view.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Dependency Check</h2>

     

      {/* Form for Path Input */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label>
          Enter Source Code Path:
          <input
            type="text"
            value={sourceCodePath}
            onChange={(e) => setSourceCodePath(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '10px', padding: '5px 10px' }}>
          Analyze
        </button>
      </form>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* View Report Button */}
      {reportUrl && (
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={openReportInNewTab}
            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            View Report 
          </button>
        </div>
      )}
    </div>
  );
};

export default DependencyCheck;
