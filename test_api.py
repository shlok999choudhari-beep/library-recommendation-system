import google.generativeai as genai
import warnings
warnings.filterwarnings("ignore")

api_key = "AIzaSyBFahl4VzVF4h2V5YxbufGE3-Jrz87Kktw"

print("Testing API Key...")
print("="*60)

try:
    genai.configure(api_key=api_key)
    
    # Test gemini-1.5-flash
    model = genai.GenerativeModel('models/gemini-1.5-flash')
    response = model.generate_content("Say hello")
    
    print("✅ SUCCESS with models/gemini-1.5-flash!")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"❌ gemini-1.5-flash failed: {str(e)[:100]}")
    
    # Try gemini-2.5-flash
    try:
        model = genai.GenerativeModel('models/gemini-2.5-flash')
        response = model.generate_content("Say hello")
        print("✅ SUCCESS with models/gemini-2.5-flash!")
        print(f"Response: {response.text}")
    except Exception as e2:
        print(f"❌ gemini-2.5-flash also failed: {str(e2)[:100]}")
