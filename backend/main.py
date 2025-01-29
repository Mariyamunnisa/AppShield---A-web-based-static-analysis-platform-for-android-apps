from flask import Flask
from flask_cors import CORS
from AndroidManifestAnalysis import analyze_apk
#from LintAnalysis import run_lint_command, get_remediation_advice  # Uncomment this after making sure the function is defined
from DependencyCheck import analyze

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Register routes from AndroidManifestAnalysis
app.add_url_rule('/analyze_apk', 'analyze_apk', analyze_apk, methods=['POST'])

# Register routes from LintAnalysis
#app.add_url_rule('/run-lint', 'run_lint', run_lint, methods=['POST'])

# Register routes from DependencyCheck
app.add_url_rule('/analyze', 'analyze', analyze, methods=['POST'])

# Main function to run the app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
