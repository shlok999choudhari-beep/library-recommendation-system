import google.generativeai as genai

# Test Gemini API directly
api_key = "AIzaSyC3HdIkp2XVlRjSyggTa6yKhxs7HfBJkdo"

print("Testing Gemini API configuration...")
print("="*50)

try:
    genai.configure(api_key=api_key)
    print("✅ API key configured")
    
    # Try with gemini-1.5-flash
    print("\nTesting model: gemini-1.5-flash")
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("✅ Model created successfully")
    
    # Test generation
    print("\nTesting content generation...")
    response = model.generate_content("Say hello in one sentence")
    print(f"✅ Response: {response.text}")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    
    # Try alternative model names
    print("\n" + "="*50)
    print("Trying alternative model names...")
    
    for model_name in ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.0-pro']:
        try:
            print(f"\nTrying: {model_name}")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Say hello")
            print(f"✅ {model_name} works! Response: {response.text}")
            break
        except Exception as e2:
            print(f"❌ {model_name} failed: {e2}")
