import sqlite3

# Connect to the database
conn = sqlite3.connect('library.db')
cursor = conn.cursor()

try:
    # Add the missing column
    cursor.execute('ALTER TABLE users ADD COLUMN hashed_password TEXT')
    print("Added hashed_password column successfully")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("Column already exists")
    else:
        print(f"Error: {e}")

conn.commit()
conn.close()
print("Migration completed")