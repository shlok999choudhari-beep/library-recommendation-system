import sqlite3

conn = sqlite3.connect('library.db')
cursor = conn.cursor()

# Check total ratings
cursor.execute('SELECT COUNT(*) FROM user_books')
total = cursor.fetchone()[0]
print(f'Total ratings in database: {total}')

# Check ratings per user
cursor.execute('SELECT user_id, COUNT(*) as count FROM user_books GROUP BY user_id')
print('\nRatings per user:')
for row in cursor.fetchall():
    print(f'  User {row[0]}: {row[1]} ratings')

# Check specific user's ratings with details
cursor.execute('''
    SELECT ub.user_id, ub.book_id, ub.rating, ub.status, b.title 
    FROM user_books ub 
    JOIN books b ON ub.book_id = b.id 
    ORDER BY ub.user_id, ub.book_id
    LIMIT 20
''')
print('\nSample user ratings:')
for row in cursor.fetchall():
    print(f'  User {row[0]}: Book "{row[4]}" - Rating: {row[2]}, Status: {row[3]}')

conn.close()
