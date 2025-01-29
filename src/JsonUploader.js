// JsonUploader.js
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import CombinedComponent from './CombinedComponent'; // Import CombinedComponent

function JsonUploader() {
  const [showUploadSection, setShowUploadSection] = useState(true); // Show upload section by default
  const [jsonData, setJsonData] = useState(null);

  // Handle JSON file upload and parsing
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setJsonData(json);
          setShowUploadSection(false); // Hide upload section after file is uploaded
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Generate PDF from JSON data
  const generatePDF = () => {
    if (!jsonData) {
      console.error('No data available for PDF generation.');
      return;
    }

    const doc = new jsPDF();
    doc.text('Uploaded JSON Data', 10, 10);

    const flattenData = (data, prefix = '') => {
      let result = [];
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          if (typeof value === 'object' && !Array.isArray(value)) {
            result = result.concat(flattenData(value, prefix + key + '.'));
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === 'object') {
                result = result.concat(flattenData(item, prefix + key + '[' + index + '].'));
              } else {
                result.push({ key: prefix + key + '[' + index + ']', value: item });
              }
            });
          } else {
            result.push({ key: prefix + key, value: value });
          }
        }
      }
      return result;
    };

    const dataRows = Array.isArray(jsonData)
      ? jsonData.flatMap((item) => flattenData(item))
      : flattenData(jsonData);

    const tableColumn = ['Key', 'Value'];
    const tableRows = dataRows.map((row) => [row.key, row.value]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 8, overflow: 'linebreak' },
    });

    doc.save('report.pdf');
  };

  // Function to generate paragraphs for specific sections
  const generateParagraphs = (section) => {
    const data = jsonData?.[section];
    if (!data) return <p>No data available for this section.</p>;

    if (typeof data === 'string') {
      return <p>{data}</p>;
    }

    return Object.entries(data).map(([key, value], index) => (
      <p key={index}>
        <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
      </p>
    ));
  };

  // Render JSON data as a table
  const renderTable = () => {
    if (!jsonData) {
      return <p>No data available. Please upload a JSON file.</p>;
    }

    const flattenData = (data, prefix = '') => {
      let result = [];
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              value.forEach((item, index) => {
                result = result.concat(flattenData(item, `${prefix}${key}[${index}].`));
              });
            } else {
              result = result.concat(flattenData(value, `${prefix}${key}.`));
            }
          } else {
            result.push({ key: prefix + key, value: value });
          }
        }
      }
      return result;
    };

    const dataRows = flattenData(jsonData);

    return (
      <table className="json-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {dataRows.length === 0 ? (
            <tr>
              <td colSpan="2">No data to display</td>
            </tr>
          ) : (
            dataRows.map((row, index) => (
              <tr key={index}>
                <td>{row.key}</td>
                <td>{typeof row.value === 'object' ? JSON.stringify(row.value) : row.value}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  // return (
  //   <div className="upload-section">
  //     {showUploadSection ? (
  //       <>
  //         <h1>Upload JSON File</h1>
  //         <input type="file" accept=".json" onChange={handleFileUpload} />
  //       </>
  //     ) : (
  //       <>
  //         <button className="back-button" onClick={() => setShowUploadSection(true)}>
  //         Clear
  //         </button>
  //         {/* Render JSON data as a table */}
  //         <div className="table-section">{renderTable()}</div>

  //         {/* Render the CombinedComponent if jsonData is available */}
  //         {jsonData && <CombinedComponent data={jsonData} />}

  //         <div className="pdf-button-container">
  //           <button onClick={generatePDF} disabled={!jsonData}>
  //             Convert to PDF
  //           </button>
  //         </div>
  //       </>
  //     )}
  //   </div>
  // );
}

export default JsonUploader;
