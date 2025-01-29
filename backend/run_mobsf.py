import requests
import time
from requests_toolbelt.multipart.encoder import MultipartEncoder

# MobSF API Configuration
API_KEY = 'e3e0d83f87b3ac5c517701a3b26207b4c47bc92c83f3c590384ed2ba715e2ad6'
MOBSF_URL = 'http://localhost:8000/api/v1'

HEADERS = {
    'Authorization': API_KEY,
}

# Upload a file (APK or IPA)
def upload_file(file_path):
    url = f"{MOBSF_URL}/upload"
    
    # Use MultipartEncoder for file upload
    m = MultipartEncoder(
        fields={'file': ('encryptor.apk', open(file_path, 'rb'), 'application/vnd.android.package-archive')}
    )
    
    headers = {
        'Authorization': API_KEY,
        'Content-Type': m.content_type
    }
    
    response = requests.post(url, headers=headers, data=m)
    response.raise_for_status()
    return response.json()

# Start a scan for the uploaded file
def scan_file(file_hash):
    url = f"{MOBSF_URL}/scan"
    data = {'hash': file_hash}
    response = requests.post(url, headers=HEADERS, data=data)
    response.raise_for_status()
    return response.json()

# Retrieve scan logs
def get_scan_logs(scan_id):
    url = f"{MOBSF_URL}/scan_logs/{scan_id}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()

# Download PDF report
def download_pdf_report(scan_id, output_path):
    url = f"{MOBSF_URL}/download_pdf/{scan_id}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    with open(output_path, 'wb') as f:
        f.write(response.content)

# Example usage
if __name__ == "__main__":
    apk_path = "/home/n00b/Downloads/encryptor.apk"  # Replace with your APK path

    # 1. Upload APK
    upload_info = upload_file(apk_path)
    file_hash = upload_info['hash']

    # 2. Scan the uploaded APK
    scan_info = scan_file(file_hash)
    print("Scan Info:", scan_info)  # Print scan_info to see its structure

    # Check for correct key in scan_info
    if 'scan_id' not in scan_info:
        print("Error: 'scan_id' not found in scan_info")
        print("Scan Info Details:", scan_info)  # Print full scan_info for debugging
    else:
        scan_id = scan_info['scan_id']

        # 3. Retrieve scan logs (polling until scan finishes)
        while True:
            scan_logs = get_scan_logs(scan_id)
            if 'Scan Finished' in scan_logs['log']:
                print("Scan completed.")
                break
            time.sleep(5)  # Wait for 5 seconds before the next poll

        # 4. Download PDF report
        download_pdf_report(scan_id, "output/encryptor_report.pdf")
