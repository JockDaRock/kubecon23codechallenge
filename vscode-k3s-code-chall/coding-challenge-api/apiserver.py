from flask import Flask, jsonify, request, redirect, url_for
import requests
from flask_cors import CORS
import subprocess
import json
import os

app = Flask(__name__)
# Disable CORS for all domains on all routes
CORS(app, resources={r"/*": {"origins": "*"}})

pytestloc = "/devnet/panoptica/occurences_req.py"

@app.route('/check_critical', methods=['GET'])
def check_critical():
    try:
        # Execute the script and capture the output
        result = subprocess.run(['python3', pytestloc], capture_output=True, text=True, check=True)
        output = result.stdout

        # Parse the output as JSON
        data = json.loads(output)

        # Navigate through the JSON to find the severity key
        severity = data.get('apiCrits', [{}])[0].get('severity', '')

        # Return True if severity is critical, False otherwise
        return jsonify({'is_critical': severity.lower() == 'critical'})
    except Exception as e:
        # If any error occurs, return False
        return jsonify({'is_critical': False}), 500

@app.route('/leaderboard', methods=['POST', 'GET'])
def leaderboard():
    # Get the URL from the environment variable or use the default if it doesn't exist
    try:
        # Get the URL from the environment variable or use the default if it doesn't exist
        url = os.environ.get('FORWARD_URL', 'https://httpbin.org/post')
        open(pytestloc, 'w').close()
        subprocess.run(['echo', '', '>', pytestloc], capture_output=True, text=True, check=True)
        
        # Forward the incoming data to the specified URL using the requests library
        response = requests.post(url, json=request.json)
        thejson = jsonify(response.json())
        print(thejson)
        return thejson, response.status_code
    except Exception as e:
        # Handle exceptions and provide feedback
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)