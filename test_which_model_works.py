import google.generativeai as genai

api_key = "AIzaSyDMbnS3xn27GJt9cvUlD8mUWA00tBZl53Y"

print("Testing which model works with your API key...")
print("="*60)

genai.configure(api_key=api_key)

models_to_test = [
    'models/gemini-1.5-flash',
    'models/gemini-2.5-flash',
    'models/gemini-1.5-pro',
    'models/gemini-pro'
]

working_model = None

for model_name in models_to_test:
    try:
        print(f"\nTesting: {model_name}")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say hello in one sentence")
        print(f"✅ SUCCESS! {model_name} works!")
        print(f"   Response: {response.text}")
        working_model = model_name
        break
    except Exception as e:
        error_msg = str(e)[:150]
        print(f"❌ Failed: {error_msg}")

if working_model:
    print(f"\n{'='*60}")
    print(f"✅ Use this model in chatbot.py: {working_model}")
    print(f"{'='*60}")
else:
    print(f"\n{'='*60}")
    print("❌ No working model found with this API key")
    print("The API key may have restrictions or quota issues")
