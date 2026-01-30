import requests
import json

try:
    response = requests.post(
        'http://localhost:8000/auth/login', 
        json={'email': 'subhi@example.com', 'password': 'password123'}, 
        timeout=5
    )
    print(f'Status: {response.status_code}')
    print(f'Response: {response.text}')
except Exception as e:
    print(f'Error: {e}')