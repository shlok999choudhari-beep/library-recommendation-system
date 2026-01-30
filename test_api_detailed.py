import requests
import json

url = "http://127.0.0.1:8000/recommend/1"

print(f"Testing: {url}")
print("="*50)

try:
    response = requests.get(url, timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"\nResponse Body:")
    
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=2))
        print(f"\nNumber of recommendations: {len(data)}")
    else:
        print(response.text)
        
except requests.exceptions.Timeout:
    print("Request timed out!")
except requests.exceptions.ConnectionError:
    print("Connection error - is the server running?")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
