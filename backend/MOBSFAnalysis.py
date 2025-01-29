from flask import Flask, request, jsonify, send_file
import requests
import time
import os
from requests_toolbelt.multipart.encoder import MultipartEncoder

app = Flask(__name__)

MOBSF_API_KEY = 'e3e0d83f87b3ac5c517701a3b26207b4c47bc92c83f3c590384ed2ba715e2ad6'
MOBSF_URL = 'http://localhost:8000/api/v1'
HEADERS = {
    'Authorization': MOBSF_API_KEY,
}

# Upload APK file to MobSF
@app.route('/upload', methods=['POST'])
def upload_apk():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    
    # Use MultipartEncoder for file upload
    m = MultipartEncoder(
        fields={'file': (file.filename, file, 'application/vnd.android.package-archive')}
    )

    upload_url = f"{MOBSF_URL}/upload"
    headers = {
        'Authorization': MOBSF_API_KEY,
        'Content-Type': m.content_type
    }
    response = requests.post(upload_url, headers=headers, data=m)

    if response.status_code != 200:
        return jsonify({'error': 'Error uploading APK to MobSF'}), response.status_code

    data = response.json()
    file_hash = data['hash']

    # Start MobSF scan
    scan_url = f"{MOBSF_URL}/scan"
    scan_response = requests.post(scan_url, headers=HEADERS, data={'hash': file_hash})

    if scan_response.status_code != 200:
        return jsonify({'error': 'Error starting scan'}), scan_response.status_code

    return jsonify(scan_response.json()), 200

# Check scan status (logs)
@app.route('/scan_logs/<scan_id>', methods=['GET'])
def scan_logs(scan_id):
    logs_url = f"{MOBSF_URL}/scan_logs/{scan_id}"
    response = requests.get(logs_url, headers=HEADERS)

    if response.status_code != 200:
        return jsonify({'error': 'Error retrieving scan logs'}), response.status_code

    if 'Scan Finished' in response.json().get('log', ''):
        return jsonify({'status': 'completed'}), 200

    return jsonify({'status': 'in_progress'}), 200

# Download PDF report
@app.route('/download_pdf/<scan_id>', methods=['GET'])
def download_pdf(scan_id):
    pdf_url = f"{MOBSF_URL}/download_pdf/{scan_id}"
    response = requests.get(pdf_url, headers=HEADERS, stream=True)

    if response.status_code != 200:
        return jsonify({'error': 'Error downloading PDF'}), response.status_code

    # Save the PDF temporarily
    pdf_path = f"{scan_id}.pdf"
    with open(pdf_path, 'wb') as f:
        f.write(response.content)

    # Send the PDF file to the frontend
    return send_file(pdf_path, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
