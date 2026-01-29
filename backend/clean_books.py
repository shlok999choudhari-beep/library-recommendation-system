from sqlalchemy.orm import Session
from app.database import get_db, engine
from app.models import Book
import re

def clean_book_data():
    """Clean book data by removing square brackets from genre and author fields"""
    db = Session(bind=engine)
    
    try:
        # Get all books
        books = db.query(Book).all()
        
        for book in books:
            # Clean author field
            if book.author and '[' in book.author:
                book.author = re.sub(r'[\[\]\'"]', '', book.author).strip()
            
            # Clean genre field  
            if book.genre and '[' in book.genre:
                book.genre = re.sub(r'[\[\]\'"]', '', book.genre).strip()
        
        db.commit()
        print(f"Cleaned {len(books)} books successfully!")
        
    except Exception as e:
        print(f"Error cleaning data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clean_book_data()