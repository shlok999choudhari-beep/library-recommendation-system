import requests

url = "http://127.0.0.1:8000/chat/"
data = {"user_id": 1, "message": "Hello, recommend a book"}

print("Testing chatbot...")
try:
    response = requests.post(url, json=data, timeout=10)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        bot_reply = result.get('response', '')
        print(f"\n✓ Chatbot Reply:\n{bot_reply}\n")
        if "Error:" in bot_reply or "technical difficulties" in bot_reply:
            print("❌ Still having issues")
        else:
            print("✅ Chatbot is working!")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Connection error: {e}")
