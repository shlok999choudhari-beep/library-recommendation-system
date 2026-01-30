import requests
import json
import time

print("Final Chatbot Verification Test")
print("="*60)
print("Waiting for backend to reload...")
time.sleep(5)

url = "http://127.0.0.1:8000/chat/"

for attempt in range(5):
    print(f"\nAttempt {attempt + 1}/5...")
    
    payload = {
        "user_id": 1,
        "message": "Hello! Recommend a mystery book."
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        data = response.json()
        
        bot_response = data.get("response", "")
        print(f"Response: {bot_response[:100]}...")
        
        if "technical difficulties" not in bot_response.lower():
            print("\n" + "="*60)
            print("✅ SUCCESS! CHATBOT IS WORKING!")
            print("="*60)
            print(f"\nFull Response:\n{bot_response}")
            break
        else:
            print("❌ Still getting error...")
            if attempt < 4:
                print("Waiting 3 more seconds...")
                time.sleep(3)
    except Exception as e:
        print(f"Error: {e}")
        if attempt < 4:
            time.sleep(3)
else:
    print("\n" + "="*60)
    print("❌ Chatbot still not working after 5 attempts")
    print("The backend server may need a manual restart")
