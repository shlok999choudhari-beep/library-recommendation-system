import google.generativeai as genai
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

api_key = "AIzaSyANJCSnYHSNG8SlUrcSIpvEgisovBzPBO0"

print("Testing API Key: AIzaSyANJCSnYHSNG8SlUrcSIpvEgisovBzPBO0")
print("="*60)

try:
    genai.configure(api_key=api_key)
    print("✅ API configured")
    
    # Try gemini-1.5-flash
    print("\nTrying: models/gemini-1.5-flash")
    model = genai.GenerativeModel('models/gemini-1.5-flash')
    response = model.generate_content("Hello", request_options={"timeout": 10})
    
    print("✅ SUCCESS! API key works!")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"❌ FAILED: {str(e)}")
    print("\nThis API key does not work.")
    print("\nYou need to:")
    print("1. Go to https://aistudio.google.com/app/apikey")
    print("2. Create a NEW API key")
    print("3. Make sure billing is enabled")
    print("4. Test it works before using it")
