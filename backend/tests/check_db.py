import sqlite3
from app.utils.security import hash_password, verify_password

def check_database():
    conn = sqlite3.connect('library.db')
    cursor = conn.cursor()
    
    # Check if users table exists and its structure
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
    if cursor.fetchone():
        print("Users table exists")
        
        # Check table structure
        cursor.execute("PRAGMA table_info(users);")
        columns = cursor.fetchall()
        print("Table structure:")
        for col in columns:
            print(f"  {col}")
        
        # Check existing users
        cursor.execute("SELECT * FROM users;")
        users = cursor.fetchall()
        print(f"Existing users: {len(users)}")
        for user in users:
            print(f"  {user}")
    else:
        print("Users table does not exist")
    
    conn.close()

def test_password_hashing():
    password = "testpass123"
    hashed = hash_password(password)
    print(f"Original: {password}")
    print(f"Hashed: {hashed}")
    print(f"Verification: {verify_password(password, hashed)}")

if __name__ == "__main__":
    check_database()
    print("\nTesting password hashing:")
    test_password_hashing()