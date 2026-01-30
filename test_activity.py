import requests
import json

# Test the activity update endpoint
base_url = "http://127.0.0.1:8000"

# First, let's check if we can get users
try:
    # Try to update activity for user 1, book 1
    params = {
        "user_id": 1,
        "book_id": 1,
        "rating": 5.0,
        "status": "read"
    }
    
    print("Testing activity update endpoint...")
    print(f"URL: {base_url}/activity/update")
    print(f"Params: {params}")
    
    response = requests.post(f"{base_url}/activity/update", params=params)
    print(f"\nResponse Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("\n✅ Activity update successful!")
    else:
        print(f"\n❌ Activity update failed!")
        
except Exception as e:
    print(f"Error: {e}")

# Now check if it was saved
print("\n" + "="*50)
print("Checking database...")
import sqlite3
conn = sqlite3.connect('library.db')
cursor = conn.cursor()
cursor.execute('SELECT * FROM user_books')
rows = cursor.fetchall()
print(f"Total ratings in database: {len(rows)}")
for row in rows:
    print(f"  {row}")
conn.close()
