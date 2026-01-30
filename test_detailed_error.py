import google.generativeai as genai
import traceback

api_key = "AIzaSyC_7L75nUgE5yd4laUDCThPtWsVHsEjk98"

print("Detailed API Key Test")
print("="*60)

try:
    genai.configure(api_key=api_key)
    print("✅ API configured")
    
    print("\nAttempting to create model: gemini-2.5-flash")
    model = genai.GenerativeModel('gemini-2.5-flash')
    print("✅ Model object created")
    
    print("\nAttempting to generate content...")
    response = model.generate_content("Hello")
    print(f"✅ SUCCESS! Response: {response.text}")
    
except Exception as e:
    print(f"\n❌ ERROR DETAILS:")
    print(f"Error Type: {type(e).__name__}")
    print(f"Error Message: {str(e)}")
    print("\nFull Traceback:")
    traceback.print_exc()
    
    # Try to list available models
    print("\n" + "="*60)
    print("Attempting to list available models...")
    try:
        models = genai.list_models()
        print("\nAvailable models:")
        for m in models:
            if 'gemini' in m.name.lower():
                print(f"  - {m.name}")
    except Exception as e2:
        print(f"Cannot list models: {e2}")
