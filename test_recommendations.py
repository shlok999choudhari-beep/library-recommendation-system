import requests

# Test the recommendations endpoint
base_url = "http://127.0.0.1:8000"

# Test for user 1 (Shlok)
user_id = 1

print("Testing recommendations endpoint...")
print(f"URL: {base_url}/recommend/{user_id}")

try:
    response = requests.get(f"{base_url}/recommend/{user_id}")
    print(f"\nResponse Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Recommendations received!")
        print(f"Number of recommendations: {len(data)}")
        
        if len(data) > 0:
            print("\nFirst 3 recommendations:")
            for i, book in enumerate(data[:3], 1):
                print(f"\n{i}. {book['title']}")
                print(f"   Author: {book['author']}")
                print(f"   Genre: {book['genre']}")
                print(f"   Rating: {book['rating']}")
        else:
            print("\n⚠️ No recommendations returned (empty array)")
    else:
        print(f"\n❌ Request failed!")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
