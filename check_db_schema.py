import sqlite3

conn = sqlite3.connect('library.db')
cursor = conn.cursor()

# Check if user_books table exists
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print("Tables in database:")
for table in tables:
    print(f"  - {table[0]}")

# Check user_books schema
print("\nuser_books table schema:")
cursor.execute("PRAGMA table_info(user_books)")
columns = cursor.fetchall()
for col in columns:
    print(f"  {col}")

# Check if there are any users
cursor.execute("SELECT id, email, name FROM users LIMIT 5")
users = cursor.fetchall()
print(f"\nUsers in database: {len(users)}")
for user in users:
    print(f"  User {user[0]}: {user[1]} ({user[2]})")

# Check if there are any books
cursor.execute("SELECT COUNT(*) FROM books")
book_count = cursor.fetchone()[0]
print(f"\nTotal books in database: {book_count}")

conn.close()
