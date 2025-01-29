import React from 'react';
import './CombinedComponent.css'; 

// Style for tables with scrollbars
const tableStyle = {
  border: '1px solid black',
  width: '100%',
  borderCollapse: 'collapse',
  maxHeight: '300px', // Adjust this height as needed
  overflowY: 'auto',

};

// Style for paragraphs
const paragraphStyle = {
  marginBottom: '20px',
};

// Basic Details Component
const BasicDetailsComponent = ({ data }) => {
  const {
    version, title, file_name, app_name, app_type, size, md5, sha1, sha256, 
    package_name, main_activity, exported_activities, browsable_activities, 
    activities, receivers, providers, services, libraries, target_sdk, 
    max_sdk, min_sdk, version_name, version_code, icon_path
  } = data;

  return (
    <div>
      <h2>Basic Details</h2>
      <table style={tableStyle}>
        <tbody>
          <tr><td>Version</td><td>{version}</td></tr>
          <tr><td>Title</td><td>{title}</td></tr>
          <tr><td>File Name</td><td>{file_name}</td></tr>
          <tr><td>App Name</td><td>{app_name}</td></tr>
          <tr><td>App Type</td><td>{app_type}</td></tr>
          <tr><td>Size</td><td>{size}</td></tr>
          <tr><td>MD5</td><td>{md5}</td></tr>
          <tr><td>SHA1</td><td>{sha1}</td></tr>
          <tr><td>SHA256</td><td>{sha256}</td></tr>
          <tr><td>Package Name</td><td>{package_name}</td></tr>
          <tr><td>Main Activity</td><td>{main_activity}</td></tr>
          <tr><td>Exported Activities</td><td>{JSON.stringify(exported_activities)}</td></tr>
          <tr><td>Browsable Activities</td><td>{JSON.stringify(browsable_activities)}</td></tr>
          <tr><td>Activities</td><td>{activities.join(', ')}</td></tr>
          <tr><td>Receivers</td><td>{receivers.join(', ')}</td></tr>
          <tr><td>Providers</td><td>{providers.join(', ')}</td></tr>
          <tr><td>Services</td><td>{services.join(', ')}</td></tr>
          <tr><td>Libraries</td><td>{libraries.join(', ')}</td></tr>
          <tr><td>Target SDK</td><td>{target_sdk}</td></tr>
          <tr><td>Max SDK</td><td>{max_sdk}</td></tr>
          <tr><td>Min SDK</td><td>{min_sdk}</td></tr>
          <tr><td>Version Name</td><td>{version_name}</td></tr>
          <tr><td>Version Code</td><td>{version_code}</td></tr>
          <tr><td>Icon Path</td><td>{icon_path}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

// Permissions Component
const PermissionsComponent = ({ data }) => {
  const { permissions } = data;

  return (
    <div>
      <h2>Permissions</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Permission</th>
            <th>Status</th>
            <th>Info</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(permissions).map(([key, value], index) => (
            <tr key={index}>
              <td>{key}</td>
              <td>{value.status}</td>
              <td>{value.info}</td>
              <td>{value.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Malware Permissions Component
const MalwarePermissionsComponent = ({ data }) => {
  const { top_malware_permissions, other_abused_permissions, total_malware_permissions, total_other_permissions } = data.malware_permissions;

  return (
    <div>
      <h2>Malware Permissions</h2>
      <h3>Top Malware Permissions</h3>
      <table style={tableStyle}>
        <tbody>
          {top_malware_permissions.length > 0 ? (
            top_malware_permissions.map((permission, index) => (
              <tr key={index}>
                <td>{permission}</td>
              </tr>
            ))
          ) : (
            <tr><td>No Top Malware Permissions</td></tr>
          )}
        </tbody>
      </table>
      <h3>Other Abused Permissions</h3>
      <table style={tableStyle}>
        <tbody>
          {other_abused_permissions.length > 0 ? (
            other_abused_permissions.map((permission, index) => (
              <tr key={index}>
                <td>{permission}</td>
              </tr>
            ))
          ) : (
            <tr><td>No Other Abused Permissions</td></tr>
          )}
        </tbody>
      </table>
      <h3>Summary</h3>
      <table style={tableStyle}>
        <tbody>
          <tr><td>Total Malware Permissions</td><td>{total_malware_permissions}</td></tr>
          <tr><td>Total Other Permissions</td><td>{total_other_permissions}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

// Certificate Analysis Component
const CertificateAnalysisComponent = ({ data }) => {
  const { certificate_info, certificate_findings, certificate_summary } = data.certificate_analysis;

  return (
    <div>
      <h2>Certificate Analysis</h2>
      <h3>Certificate Info</h3>
      <pre style={paragraphStyle}>{certificate_info}</pre>
      <h3>Certificate Findings</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {certificate_findings.map((finding, index) => (
            <tr key={index}>
              <td>{finding[0]}</td>
              <td>{finding[1]}</td>
              <td>{finding[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Summary</h3>
      <table style={tableStyle}>
        <tbody>
          <tr><td>High</td><td>{certificate_summary.high}</td></tr>
          <tr><td>Warning</td><td>{certificate_summary.warning}</td></tr>
          <tr><td>Info</td><td>{certificate_summary.info}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

// Manifest Analysis Component
const ManifestAnalysisComponent = ({ data }) => {
  const { manifest_findings, manifest_summary } = data.manifest_analysis;

  return (
    <div>
      <h2>Manifest Analysis</h2>
      <h3>Findings</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Rule</th>
            <th>Title</th>
            <th>Severity</th>
            <th>Description</th>
            <th>Name</th>
            <th>Component</th>
          </tr>
        </thead>
        <tbody>
          {manifest_findings.map((finding, index) => (
            <tr key={index}>
              <td>{finding.rule}</td>
              <td dangerouslySetInnerHTML={{ __html: finding.title }}></td>
              <td>{finding.severity}</td>
              <td>{finding.description}</td>
              <td>{finding.name}</td>
              <td>{finding.component.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Summary</h3>
      <table style={tableStyle}>
        <tbody>
          <tr><td>High</td><td>{manifest_summary.high}</td></tr>
          <tr><td>Warning</td><td>{manifest_summary.warning}</td></tr>
          <tr><td>Info</td><td>{manifest_summary.info}</td></tr>
          <tr><td>Suppressed</td><td>{manifest_summary.suppressed}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

// API Analysis Component
const ApiAnalysisComponent = ({ data }) => {
  const { api_crypto, api_local_file_io, api_base64_encode, api_base64_decode } = data.android_api;

  return (
    <div>
      <h2>API Analysis</h2>
      <h3>Crypto</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>File</th>
            <th>Lines</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(api_crypto.files).map(([file, lines], index) => (
            <tr key={index}>
              <td>{file}</td>
              <td>{lines}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Local File I/O Operations</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>File</th>
            <th>Lines</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(api_local_file_io.files).map(([file, lines], index) => (
            <tr key={index}>
              <td>{file}</td>
              <td>{lines}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Base64 Encoding/Decoding</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>File</th>
            <th>Lines</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(api_base64_encode.files).map(([file, lines], index) => (
            <tr key={index}>
              <td>{file}</td>
              <td>{lines}</td>
            </tr>
          ))}
          {Object.entries(api_base64_decode.files).map(([file, lines], index) => (
            <tr key={index}>
              <td>{file}</td>
              <td>{lines}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// App Security Component
const AppSecComponent = ({ data }) => {
  const { high, warning, info, secure, total_trackers, trackers, security_score, app_name, file_name, hash, version_name } = data.appsec;

  return (
    <div>
      <h2>App Security</h2>
      <h3>High</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Section</th>
          </tr>
        </thead>
        <tbody>
          {high.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.section}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Warning</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Section</th>
          </tr>
        </thead>
        <tbody>
          {warning.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.section}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Info</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Section</th>
          </tr>
        </thead>
        <tbody>
          {info.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.section}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Secure</h3>
      <div style={paragraphStyle}>
        {secure.map((item, index) => (
          <div key={index}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <p><strong>Section:</strong> {item.section}</p>
          </div>
        ))}
      </div>
      <h3>Summary</h3>
      <table style={tableStyle}>
        <tbody>
          <tr><td>Total Trackers</td><td>{total_trackers}</td></tr>
          <tr><td>Trackers</td><td>{trackers}</td></tr>
          <tr><td>Security Score</td><td>{security_score}</td></tr>
          <tr><td>App Name</td><td>{app_name}</td></tr>
          <tr><td>File Name</td><td>{file_name}</td></tr>
          <tr><td>Hash</td><td>{hash}</td></tr>
          <tr><td>Version Name</td><td>{version_name}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

// Combined Component
const CombinedComponent = ({ data }) => {
  return (
    <div>
      <BasicDetailsComponent data={data} />
      <PermissionsComponent data={data} />
      <MalwarePermissionsComponent data={data} />
      <CertificateAnalysisComponent data={data} />
      <ManifestAnalysisComponent data={data} />
      <ApiAnalysisComponent data={data} />
      <AppSecComponent data={data} />
    </div>
  );
};

export default CombinedComponent;
