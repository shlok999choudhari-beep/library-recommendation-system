import google.generativeai as genai
import os

# Use the API key from the chatbot.py file
genai.configure(api_key="AIzaSyBFahl4VzVF4h2V5YxbufGE3-Jrz87Kktw")

print("Listing available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error listing models: {e}")
