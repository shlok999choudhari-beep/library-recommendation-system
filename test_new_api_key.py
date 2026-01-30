import google.generativeai as genai

# Test the new API key
api_key = "AIzaSyC3HdIkp2XVlRjSyggTa6yKhxs7HfBJkdo"

print("Testing new Gemini API key...")
print("="*50)

try:
    genai.configure(api_key=api_key)
    print("✅ API key configured")
    
    # Test with gemini-1.5-flash
    print("\nTesting model: gemini-1.5-flash")
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("✅ Model created successfully")
    
    # Test generation
    print("\nTesting content generation...")
    response = model.generate_content("Recommend a good science fiction book in one sentence")
    print(f"✅ Response received!")
    print(f"\nBot says: {response.text}")
    
    print("\n" + "="*50)
    print("✅ Gemini API is working correctly!")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
