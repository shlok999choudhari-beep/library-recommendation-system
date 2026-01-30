import requests
import json

# Test login endpoint
url = "http://127.0.0.1:8000/auth/login"
data = {
    "email": "subhi@example.com",
    "password": "password123"
}

try:
    response = requests.post(url, json=data, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except requests.exceptions.Timeout:
    print("Request timed out")
except requests.exceptions.ConnectionError:
    print("Connection error - backend not running")
except Exception as e:
    print(f"Error: {e}")