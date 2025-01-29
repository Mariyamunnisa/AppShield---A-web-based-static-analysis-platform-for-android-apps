from flask import Flask, request, jsonify, send_from_directory  # Added send_from_directory
from flask_cors import CORS
import subprocess
import os
import requests
import logging
from dotenv import load_dotenv
import json  # Import the json module

# Load environment variables from .env file
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

LINT_EXECUTABLE_PATH = '/home/asif/Android/Sdk/cmdline-tools/latest/bin/lint'
REPORTS_DIR = os.path.join(os.getcwd(), 'reports')
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

os.makedirs(REPORTS_DIR, exist_ok=True)

def run_lint_command(command_args):
    try:
        result = subprocess.run(command_args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        if result.returncode != 0:
            logger.error(f"Lint command failed: {result.stderr}")
            return {'error': result.stderr}, 500

        report_path = command_args[-1]
        if os.path.exists(report_path):
            with open(report_path, 'r') as file:
                report = file.read()
            return report
        else:
            logger.error(f"Report file not found: {report_path}")
            return {'error': 'Report file not found'}, 500
    except Exception as e:
        logger.error(f"Exception during lint execution: {str(e)}")
        return {'error': str(e)}, 500

def get_remediation_advice(findings):
    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"Provide detailed remediation advice for the following findings:\n{json.dumps(findings, indent=4)}"}]
            }
        ]
    }

    try:
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={GEMINI_API_KEY}",
            headers=headers,
            json=data
        )
        response.raise_for_status()  # Raise an error for bad HTTP status codes
        response_data = response.json()
        
        if 'candidates' in response_data and len(response_data['candidates']) > 0:
            candidate_content = response_data['candidates'][0]['content']['parts'][0]['text']
            logger.info(f"Response from Gemini API: {candidate_content}")
            return candidate_content
        else:
            logger.error("Unexpected response format: 'candidates' key not found or empty.")
            return "Error processing the AI API response. Please try again later."
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {e}")
        return "Error connecting to the AI API. Please try again later."
    except KeyError as e:
        logger.error(f"Key error in response data: {e}")
        return "Error processing the AI API response. Please try again later."

@app.route('/run-lint', methods=['POST'])
def run_lint():
    data = request.get_json()
    path = data.get('path')
    analysis_type = data.get('analysisType')

    if not path or not os.path.exists(path):
        return jsonify({'error': 'Invalid or nonexistent path provided'}), 400

    report_path = os.path.join(REPORTS_DIR, 'lint-report.html')
    lint_command = []

    if analysis_type == 'basic':
        lint_command = [LINT_EXECUTABLE_PATH, '--html', report_path, path]
    elif analysis_type == 'docs':
        lint_command = [LINT_EXECUTABLE_PATH, '--generate-docs', '--output', report_path]
    elif analysis_type == 'errors':
        lint_command = [LINT_EXECUTABLE_PATH, '--html', report_path, '--severity', 'error', path]
    elif analysis_type == 'fatal':
        lint_command = [LINT_EXECUTABLE_PATH, '--html', report_path, '--severity', 'fatal', path]
    elif analysis_type == 'baseline':
        lint_command = [LINT_EXECUTABLE_PATH, '--baseline', 'baseline.xml', '--html', report_path, path]
    elif analysis_type == 'config':
        lint_command = [LINT_EXECUTABLE_PATH, '--config', 'lint.xml', '--html', report_path, path]
    else:
        return jsonify({'error': 'Invalid analysis type'}), 400

    lint_report = run_lint_command(lint_command)
    if isinstance(lint_report, dict) and 'error' in lint_report:
        return jsonify(lint_report), 500

    findings = {'report': lint_report}
    remediation_advice = get_remediation_advice(findings)

    return jsonify({
        'lint_report': lint_report,
        'remediation_advice': remediation_advice
    })

@app.route('/reports/<path:filename>')
def serve_report(filename):
    return send_from_directory(REPORTS_DIR, filename)  # This line uses send_from_directory

if __name__ == '__main__':
    app.run(debug=True, port=4000)
