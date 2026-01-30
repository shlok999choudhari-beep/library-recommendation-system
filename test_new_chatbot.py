import requests
import json

def test_new_chatbot():
    url = "http://127.0.0.1:8000/chat/"
    headers = {"Content-Type": "application/json"}
    # Using user_id 1 (admin) for testing
    data = {"user_id": 1, "message": "What technology books do you have?"}
    
    print(f"Testing Chatbot API at {url}...")
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"Error Response: {response.text}")
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    test_new_chatbot()
