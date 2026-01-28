import sqlite3
import os
from app.database import Base, engine
from app.models import User, Book, UserBook

def reset_database():
    # Remove existing database
    if os.path.exists('library.db'):
        os.remove('library.db')
        print("Removed existing database")
    
    # Create new database with correct schema
    Base.metadata.create_all(bind=engine)
    print("Created new database with correct schema")

if __name__ == "__main__":
    reset_database()