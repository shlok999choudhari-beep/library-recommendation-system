import csv
import sqlite3
import os
import sys

CSV_FILE = 'books_1500_real_descriptions.csv'
DB_FILE = 'library.db'


def clean_field(val):
    if val is None:
        return ''
    s = str(val).strip()
    # remove Python-like list wrappers: [ 'A', 'B' ] or ['A']
    if s.startswith("[") and s.endswith("]"):
        s = s[1:-1]
    # strip surrounding quotes and whitespace
    s = s.strip(" \"'")
    # replace multiple separators
    s = s.replace("', '", ", ").replace("", "")
    return s


def ensure_tables(conn):
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            genre TEXT,
            description TEXT,
            cover_image TEXT
        )
        """
    )
    conn.commit()


def import_csv(csv_path, db_path):
    if not os.path.exists(csv_path):
        print(f"CSV file not found: {csv_path}")
        return

    conn = sqlite3.connect(db_path)
    ensure_tables(conn)

    added = 0
    with open(csv_path, newline='', encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = clean_field(row.get('title', '')).strip()
            author = clean_field(row.get('author', '')).strip()
            genre = clean_field(row.get('genre', '')).strip()
            description = row.get('description', '') or ''

            if not title or not author:
                continue

            # avoid duplicates by title+author
            cur = conn.execute(
                'SELECT id FROM books WHERE title = ? AND author = ?', (title, author)
            )
            if cur.fetchone():
                continue

            conn.execute(
                'INSERT INTO books (title, author, genre, description) VALUES (?, ?, ?, ?)',
                (title, author, genre, description)
            )
            added += 1

    conn.commit()
    conn.close()
    print(f"Imported {added} new books into {db_path}")


if __name__ == '__main__':
    csv_path = sys.argv[1] if len(sys.argv) > 1 else CSV_FILE
    db_path = sys.argv[2] if len(sys.argv) > 2 else DB_FILE
    import_csv(csv_path, db_path)
