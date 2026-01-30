import requests
import json

def test_chatbot():
    url = "http://127.0.0.1:8000/chat/"
    headers = {"Content-Type": "application/json"}
    data = {"user_id": 1, "message": "Recommend me a sci-fi book"}
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_chatbot()
