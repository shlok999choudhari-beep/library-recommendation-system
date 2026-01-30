import requests
import json

print("Testing chatbot endpoint...")
print("=" * 50)

url = "http://127.0.0.1:8000/chat/"
data = {"user_id": 1, "message": "Hello"}

try:
    response = requests.post(url, json=data, timeout=10)
    print(f"✓ Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✓ Response received: {result.get('response', 'No response')[:100]}")
    else:
        print(f"✗ Error: {response.text}")
except requests.exceptions.ConnectionError:
    print("✗ Cannot connect to backend. Is the server running?")
except Exception as e:
    print(f"✗ Error: {e}")

print("=" * 50)
