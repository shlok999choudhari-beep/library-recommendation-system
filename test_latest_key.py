import google.generativeai as genai

# Test the newest API key
api_key = "AIzaSyDMbnS3xn27GJt9cvUlD8mUWA00tBZl53Y"

print("Testing API Key: AIzaSyDMbnS3xn27GJt9cvUlD8mUWA00tBZl53Y")
print("="*60)

try:
    genai.configure(api_key=api_key)
    print("✅ API configured")
    
    # Try models/gemini-2.5-flash first
    print("\nTrying: models/gemini-2.5-flash")
    model = genai.GenerativeModel('models/gemini-2.5-flash')
    response = model.generate_content("Recommend a mystery book in one sentence")
    
    print("✅ SUCCESS! API key works!")
    print(f"\nBot Response: {response.text}")
    print("\n" + "="*60)
    print("✅ This API key is working! Updating chatbot.py now...")
    
except Exception as e:
    print(f"❌ models/gemini-2.5-flash failed: {str(e)[:200]}")
    
    # Try alternative models
    print("\nTrying alternative models...")
    for model_name in ['models/gemini-1.5-flash', 'models/gemini-pro', 'gemini-pro']:
        try:
            print(f"\nTrying: {model_name}")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hello")
            print(f"✅ {model_name} works!")
            print(f"Response: {response.text}")
            break
        except Exception as e2:
            print(f"❌ Failed: {str(e2)[:100]}")
