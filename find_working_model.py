import google.generativeai as genai

api_key = "AIzaSyC3HdIkp2XVlRjSyggTa6yKhxs7HfBJkdo"

print("Testing different Gemini models...")
print("="*50)

genai.configure(api_key=api_key)

# List of models to try
models_to_try = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.0-pro',
    'models/gemini-pro',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro'
]

working_model = None

for model_name in models_to_try:
    try:
        print(f"\nTrying: {model_name}")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say hello in one sentence")
        print(f"✅ SUCCESS! {model_name} works!")
        print(f"   Response: {response.text}")
        working_model = model_name
        break
    except Exception as e:
        print(f"❌ Failed: {str(e)[:100]}")

if working_model:
    print(f"\n{'='*50}")
    print(f"✅ Use this model name: {working_model}")
else:
    print(f"\n{'='*50}")
    print("❌ No working model found")
