import google.generativeai as genai

api_key = "AIzaSyCqFL_PeBfzy9wE2YDH5dMeK7mU0kdfq_c"

print("Testing API Key: AIzaSyCqFL_PeBfzy9wE2YDH5dMeK7mU0kdfq_c")
print("="*60)

try:
    genai.configure(api_key=api_key)
    
    # Test with gemini-2.5-flash
    print("\nTrying: models/gemini-2.5-flash")
    model = genai.GenerativeModel('models/gemini-2.5-flash')
    response = model.generate_content("Recommend a science fiction book in one sentence")
    
    print("✅ SUCCESS! API key works!")
    print(f"\nBot Response: {response.text}")
    print("\n" + "="*60)
    print("✅ This API key is WORKING! Updating chatbot now...")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    
    # Try alternative models
    print("\nTrying alternative models...")
    for model_name in ['models/gemini-1.5-flash', 'models/gemini-1.5-pro']:
        try:
            print(f"\nTrying: {model_name}")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hello")
            print(f"✅ {model_name} works!")
            print(f"Response: {response.text}")
            break
        except Exception as e2:
            print(f"❌ Failed: {str(e2)[:100]}")
