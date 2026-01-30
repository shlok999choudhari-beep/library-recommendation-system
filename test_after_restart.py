import requests
import json
import time

print("Waiting for backend server to start...")
time.sleep(8)

print("\nTesting Chatbot API...")
print("="*60)

url = "http://127.0.0.1:8000/chat/"
payload = {
    "user_id": 1,
    "message": "Hello! Can you recommend a good science fiction book?"
}

try:
    response = requests.post(url, json=payload, timeout=15)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        bot_response = data.get("response", "")
        
        print(f"\nBot Response:\n{bot_response}")
        
        if "technical difficulties" not in bot_response.lower():
            print("\n" + "="*60)
            print("✅ SUCCESS! CHATBOT IS WORKING!")
            print("="*60)
        else:
            print("\n❌ Still getting error message")
    else:
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"Error: {e}")
    print("\nBackend server may still be starting up...")
