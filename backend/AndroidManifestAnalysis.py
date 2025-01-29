from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import json
import os
from androguard.core.bytecodes.apk import APK
from xml.dom import minidom
import lxml.etree as ET
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

DANGEROUS_PERMISSIONS = [
    'android.permission.READ_SMS', 'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.READ_EXTERNAL_STORAGE', 'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.CAMERA', 'android.permission.READ_CONTACTS'
]
INJECTION_PRONE_INTENTS = [
    'android.intent.action.VIEW', 'android.intent.action.SEND',
    'android.intent.action.SENDTO', 'android.intent.action.PICK'
]

def analyze_manifest(apk_file):
    apk = APK(apk_file)
    manifest_xml = apk.get_android_manifest_xml()
    manifest_xml_str = ET.tostring(manifest_xml, encoding='unicode')
    manifest_dom = minidom.parseString(manifest_xml_str)

    findings = []
    exported_components = []
    potential_injection_points = []
    insecure_api_usage = []

    components = (
        manifest_dom.getElementsByTagName('activity') +
        manifest_dom.getElementsByTagName('service') +
        manifest_dom.getElementsByTagName('receiver') +
        manifest_dom.getElementsByTagName('provider')
    )

    for component in components:
        component_name = component.getAttribute('android:name')
        component_type = component.tagName

        if component.getAttribute('android:exported') == 'true':
            exported_components.append(f"{component_type.capitalize()}: {component_name}")

        intent_filters = component.getElementsByTagName('intent-filter')
        for intent_filter in intent_filters:
            actions = intent_filter.getElementsByTagName('action')
            categories = intent_filter.getElementsByTagName('category')
            data_elements = intent_filter.getElementsByTagName('data')

            for action in actions:
                action_name = action.getAttribute('android:name')
                if action_name in INJECTION_PRONE_INTENTS:
                    potential_injection_points.append({
                        'component': f"{component_type}: {component_name}",
                        'action': action_name,
                        'categories': [cat.getAttribute('android:name') for cat in categories],
                        'data': [
                            {attr: data.getAttribute(f'android:{attr}') 
                             for attr in ['scheme', 'host', 'port', 'path', 'pathPattern', 'mimeType'] 
                             if data.hasAttribute(f'android:{attr}')}
                            for data in data_elements
                        ]
                    })

        if component_type == 'provider':
            if component.getAttribute('android:grantUriPermissions') == 'true':
                insecure_api_usage.append(f"Insecure Content Provider: {component_name} (grantUriPermissions=true)")

    permissions = manifest_dom.getElementsByTagName('uses-permission')
    overprivileged_permissions = [
        perm.getAttribute('android:name') 
        for perm in permissions 
        if perm.getAttribute('android:name') in DANGEROUS_PERMISSIONS
    ]

    if overprivileged_permissions:
        findings.append(('improper_permissions', overprivileged_permissions, ()))

    if exported_components:
        findings.append(('exported_components', exported_components, ()))

    if potential_injection_points:
        findings.append(('potential_injection_points', potential_injection_points, ()))

    if insecure_api_usage:
        findings.append(('insecure_api_usage', insecure_api_usage, ()))

    return {
        'findings': findings,
        'exported_components': exported_components,
        'potential_injection_points': potential_injection_points,
        'overprivileged_permissions': overprivileged_permissions,
        'insecure_api_usage': insecure_api_usage,
    }

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
        
        # Extract the content from the response data
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


@app.route('/analyze_apk', methods=['POST'])
def analyze_apk():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        filename = file.filename
        filepath = os.path.join('/tmp', filename)
        file.save(filepath)
        
        manifest_analysis = analyze_manifest(filepath)
        remediation_advice = get_remediation_advice(manifest_analysis['findings'])
        
        # Clean up the temporary file
        os.remove(filepath)
        
        return jsonify({
            'manifest_analysis': manifest_analysis,
            'remediation_advice': remediation_advice
        })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)