from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Book, UserBook
from datetime import datetime, timedelta
import requests
import urllib.parse

def get_book_cover_from_openlibrary(title, author):
    """Fetch book cover URL from Open Library API, with Amazon fallback"""
    try:
        # Try Open Library first
        search_url = f"https://openlibrary.org/search.json?title={urllib.parse.quote(title)}&author={urllib.parse.quote(author)}&limit=1"
        response = requests.get(search_url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if 'docs' in data and len(data['docs']) > 0:
                book = data['docs'][0]
                if 'cover_i' in book:
                    return f"https://covers.openlibrary.org/b/id/{book['cover_i']}-L.jpg"
                elif 'isbn' in book and len(book['isbn']) > 0:
                    return f"https://covers.openlibrary.org/b/isbn/{book['isbn'][0]}-L.jpg"
        
        # Fallback to Amazon search
        return get_book_cover_from_amazon(title, author)
    except:
        return get_book_cover_from_amazon(title, author)

def get_book_cover_from_amazon(title, author):
    """Fallback: Try to get book cover from Amazon via Google Books API or generate URL"""
    try:
        # Method 1: Try Google Books API for ISBN, then use Amazon
        query = f"{title} {author}".strip()
        encoded_query = urllib.parse.quote(query)
        url = f"https://www.googleapis.com/books/v1/volumes?q={encoded_query}&maxResults=1"
        
        response = requests.get(url, timeout=3)
        if response.status_code == 200:
            data = response.json()
            if 'items' in data and len(data['items']) > 0:
                book = data['items'][0]
                if 'volumeInfo' in book:
                    # Try to get ISBN for Amazon lookup
                    if 'industryIdentifiers' in book['volumeInfo']:
                        for identifier in book['volumeInfo']['industryIdentifiers']:
                            if identifier['type'] in ['ISBN_13', 'ISBN_10']:
                                isbn = identifier['identifier']
                                return f"https://images-na.ssl-images-amazon.com/images/P/{isbn}.01.L.jpg"
        
        # Method 2: Generate Amazon search-based URL
        search_term = f"{title}-{author}".lower()
        search_term = ''.join(c if c.isalnum() else '-' for c in search_term)
        search_term = '-'.join(filter(None, search_term.split('-')))  # Remove empty parts
        
        return f"https://images-na.ssl-images-amazon.com/images/P/{search_term}.jpg"
    except:
        return None

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/weekly-top")
def get_weekly_top_books(db: Session = Depends(get_db)):
    """Get top 5 books read this week across all users"""
    # Since UserBook doesn't have updated_at, get most popular books by read count
    popular_reads = db.query(
        Book.id,
        Book.title,
        Book.author,
        Book.genre,
        func.count(UserBook.id).label('read_count')
    ).join(
        UserBook, Book.id == UserBook.book_id
    ).filter(
        UserBook.status == 'read'
    ).group_by(
        Book.id, Book.title, Book.author, Book.genre
    ).order_by(
        func.count(UserBook.id).desc()
    ).limit(5).all()
    
    return [{
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "genre": book.genre,
        "cover_image": db.query(Book.cover_image).filter(Book.id == book.id).scalar(),
        "read_count": book.read_count
    } for book in popular_reads]

@router.post("/add")
def add_book(
    title: str,
    author: str,
    genre: str,
    description: str,
    db: Session = Depends(get_db)
):
    # Get cover image from Open Library API
    cover_image = get_book_cover_from_openlibrary(title, author)
    
    book = Book(
        title=title,
        author=author,
        genre=genre,
        description=description,
        cover_image=cover_image
    )
    db.add(book)
    db.commit()
    db.refresh(book)

    return {"message": "Book added", "book_id": book.id}

@router.get("/")
def list_books(db: Session = Depends(get_db)):
    from app.models import UserBook
    books = db.query(Book).all()
    result = []
    
    for book in books:
        # Calculate average rating
        book_ratings = db.query(UserBook.rating).filter(UserBook.book_id == book.id).all()
        avg_rating = sum(r[0] for r in book_ratings) / len(book_ratings) if book_ratings else 0.0
        
        result.append({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "description": book.description,
            "cover_image": book.cover_image,
            "rating": round(avg_rating, 1)
        })
    
    return result
