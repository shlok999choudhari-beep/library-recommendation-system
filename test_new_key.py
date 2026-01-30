import google.generativeai as genai

# Test the new API key
api_key = "AIzaSyC_7L75nUgE5yd4laUDCThPtWsVHsEjk98"

print("Testing new Gemini API key...")
print("="*50)

genai.configure(api_key=api_key)

# Test with gemini-2.5-flash (as you specified)
models_to_try = [
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-pro',
    'gemini-1.5-pro'
]

working_model = None

for model_name in models_to_try:
    try:
        print(f"\nTrying: {model_name}")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Recommend a science fiction book in one sentence")
        print(f"✅ SUCCESS! {model_name} works!")
        print(f"   Response: {response.text}")
        working_model = model_name
        break
    except Exception as e:
        print(f"❌ Failed: {str(e)[:150]}")

if working_model:
    print(f"\n{'='*50}")
    print(f"✅ Chatbot is ready with model: {working_model}")
    print(f"✅ The backend should auto-reload and chatbot will work!")
else:
    print(f"\n{'='*50}")
    print("❌ API key still not working with any models")
