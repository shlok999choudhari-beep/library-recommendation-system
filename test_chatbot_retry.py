import requests
import json
import time

print("Testing chatbot API endpoint with detailed error tracking...")
print("="*60)

url = "http://127.0.0.1:8000/chat/"
payload = {
    "user_id": 1,
    "message": "Hello, can you recommend a book?"
}

# Try multiple times in case server is reloading
for attempt in range(3):
    print(f"\nAttempt {attempt + 1}/3...")
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"Status: {response.status_code}")
        
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if "technical difficulties" not in data.get("response", "").lower():
            print("\n✅ SUCCESS! Chatbot is working!")
            break
        else:
            print("\n❌ Still getting error message")
            if attempt < 2:
                print("Waiting 3 seconds for server to reload...")
                time.sleep(3)
    except Exception as e:
        print(f"Error: {e}")
        if attempt < 2:
            time.sleep(3)

print("\n" + "="*60)
