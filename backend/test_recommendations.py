#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, Book, UserBook

def test_recommendation_data():
    db = SessionLocal()
    
    try:
        # Check users
        users = db.query(User).all()
        print(f"Users in database: {len(users)}")
        for user in users[:3]:
            print(f"  - User {user.id}: {user.name or 'No name'} ({user.email})")
        
        # Check books
        books = db.query(Book).all()
        print(f"\nBooks in database: {len(books)}")
        for book in books[:3]:
            print(f"  - Book {book.id}: {book.title} by {book.author}")
        
        # Check interactions
        interactions = db.query(UserBook).all()
        print(f"\nInteractions in database: {len(interactions)}")
        for interaction in interactions[:3]:
            print(f"  - User {interaction.user_id} -> Book {interaction.book_id} (Rating: {interaction.rating})")
        
        if len(users) == 0:
            print("\n❌ No users found - recommendations will fail")
        if len(books) == 0:
            print("\n❌ No books found - recommendations will fail")
        if len(interactions) == 0:
            print("\n⚠️  No interactions found - will use content-based only")
            
    except Exception as e:
        print(f"Database error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_recommendation_data()