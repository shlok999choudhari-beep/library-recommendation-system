import google.generativeai as genai

# Final verification test
api_key = "AIzaSyC_7L75nUgE5yd4laUDCThPtWsVHsEjk98"

print("Final Verification Test")
print("="*60)

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('models/gemini-2.5-flash')
    
    print("Testing chatbot with actual book question...")
    response = model.generate_content("Recommend a good mystery book in one sentence")
    
    print("✅ SUCCESS! Chatbot is working!")
    print(f"\nBot Response: {response.text}")
    print("\n" + "="*60)
    print("✅ The chatbot should now work in your application!")
    print("✅ Backend server will auto-reload with the fix")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
