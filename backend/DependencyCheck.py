from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Function to run the Dependency Check analysis
def run_dependency_check(path):
    try:
        # Command to execute dependency-check.sh script with --noupdate option
        subprocess.run(
            ['./dependency-check.sh', '--project', 'Your Project', '--scan', path, '--format', 'HTML', '--noupdate'], 
            cwd='/home/asif/Desktop/dependency-check/bin', 
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )

        # Path to the generated report
        report_path = '/home/asif/Desktop/dependency-check/bin/dependency-check-report.html'
        if os.path.exists(report_path):
            return report_path
        else:
            return None

    except Exception as e:
        return str(e)

# Route for analyzing the code
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    source_code_path = data.get('source_code_path')

    if not os.path.exists(source_code_path):
        return jsonify({'error': 'Source code path does not exist'}), 400

    report_path = run_dependency_check(source_code_path)
    if report_path and os.path.exists(report_path):
        return send_file(report_path, mimetype='text/html')
    else:
        return jsonify({'error': 'Failed to generate report'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
