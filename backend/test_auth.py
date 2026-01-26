import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_auth():
    # Test registration
    register_data = {
        "email": "test@example.com",
        "password": "testpass123",
        "role": "user"
    }
    
    try:
        print("Testing registration...")
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        print(f"Register response: {response.status_code} - {response.text}")
        
        # Test login
        login_data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        
        print("Testing login...")
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Login response: {response.status_code} - {response.text}")
        
    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to server. Make sure the FastAPI server is running on http://127.0.0.1:8000")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_auth()