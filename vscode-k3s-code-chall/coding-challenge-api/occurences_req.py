import os
import json
import requests
from urllib.parse import urlparse
import datetime
from panop_escher import EscherAuthPlugin
from dotenv import load_dotenv
load_dotenv()

def convert_json_format_if_critical(original_json):
    # Define the new keys we want to map from the old ones
    key_map = {
        'severity': 'severity',
        'name': 'name',
        'id': 'id',
        'source': 'source',
        'description': 'description'
    }
    
    # Initialize the new JSON structure
    new_json = {'apiCrits': []}
    
    # Iterate over the items in the original JSON
    for item in original_json['items']:
        # Only convert the format if the severity is 'Critical'
        if item.get('severity', '').lower() == 'critical':
            # Create a new dictionary for the current item
            new_item = {}
            for new_key, old_key in key_map.items():
                # Map the old key to the new key, and format the severity value to lowercase
                new_item[new_key] = item.get(old_key, '').lower() if old_key == 'severity' else item.get(old_key, 'You done messed up')

                # For unspecified keys, set a default message
                if new_key == 'name' and old_key not in item:
                    new_item[new_key] = "Stop messing things up"
                if new_key == 'id' and old_key not in item:
                    new_item[new_key] = "000000"
                if new_key == 'source' and old_key not in item:
                    new_item[new_key] = "somesource"
                if new_key == 'description' and old_key not in item:
                    new_item[new_key] = "You done messed up"

            # Append the new item dictionary to the apiCrits list
            new_json['apiCrits'].append(new_item)
    
    return new_json

def get_trace_findings(url, access_key, secret_key):
    date_format = '%Y%m%dT%H%M%SZ'
    date_string = datetime.datetime.utcnow().strftime(date_format)
    date = datetime.datetime.strptime(date_string, date_format)

    panop_headers = {'X-Escher-Date': date_string, 'content-type': '*/*', 'APISEC-AUTH': 'escher'}

    response = requests.get(url + "/apisec/trace-analysis/apis/findings?orderBy=HighestSeverity&isDesc=true", headers=panop_headers, auth=EscherAuthPlugin(access_key, secret_key))

    try:
        response_json = json.loads(response.text)
        return response_json
    except json.JSONDecodeError:
        print("No data received from server.")
        print(response.request.headers)
        return None

def main():
    url = "https://portshift.panoptica.app"
    access_key = os.getenv('ACCESS_KEY')
    secret_key = os.getenv('SECRET_KEY')
    findings = get_trace_findings(url, access_key, secret_key)
    final_json = convert_json_format_if_critical(findings)
    print(json.dumps(final_json, indent=4, sort_keys=True))

if __name__ == "__main__":
    main()