from fastapi import APIRouter, Depends, HTTPException
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
        
        # Fallback: Generate a placeholder based on title
        return f"https://via.placeholder.com/300x450/374151/9CA3AF?text={urllib.parse.quote(title[:20])}"
    except:
        return f"https://via.placeholder.com/300x450/374151/9CA3AF?text=Book+Cover"

def clean_brackets(text):
    """Remove square brackets from text"""
    if text:
        return text.replace('[', '').replace(']', '').replace("'", "")
    return text

router = APIRouter(prefix="/books", tags=["books"])

@router.get("/cover/{book_id}")
def get_book_cover(book_id: int, db: Session = Depends(get_db)):
    """Get book cover for a specific book"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        return {"cover_url": None}
    
    # If book already has a cover, return it
    if book.cover_image:
        return {"cover_url": book.cover_image}
    
    # Otherwise, fetch and save it
    cover_url = get_book_cover_from_openlibrary(book.title, book.author)
    book.cover_image = cover_url
    db.commit()
    
    return {"cover_url": cover_url}

@router.post("/add")
def add_book(book_data: dict, db: Session = Depends(get_db)):
    """Add a new book to the database"""
    # Get cover image
    cover_url = get_book_cover_from_openlibrary(book_data['title'], book_data['author'])
    
    new_book = Book(
        title=book_data['title'],
        author=book_data['author'],
        genre=book_data.get('genre', ''),
        description=book_data.get('description', ''),
        cover_image=cover_url
    )
    
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    
    return {"message": "Book added successfully", "book_id": new_book.id}

@router.get("/")
def get_books(db: Session = Depends(get_db)):
    """Get all books with their average ratings using a single efficient query"""
    # Optimized query: Fetch books and their average rating in one go using LEFT JOIN
    books_query = db.query(
        Book,
        func.coalesce(func.avg(UserBook.rating), 0).label('avg_rating')
    ).outerjoin(
        UserBook, (Book.id == UserBook.book_id) & (UserBook.rating.isnot(None))
    ).group_by(Book.id).all()
    
    result = []
    for book, avg_rating in books_query:
        result.append({
            "id": book.id,
            "title": book.title,
            "author": clean_brackets(book.author),
            "genre": clean_brackets(book.genre),
            "description": book.description,
            "cover_image": book.cover_image,
            "rating": round(float(avg_rating), 1)
        })
    
    return result

@router.get("/weekly-top")
def get_weekly_top_books(db: Session = Depends(get_db)):
    """Get top 10 books read/rated (using overall top as proxy for weekly due to schema limitation)"""
    # Note: UserBook doesn't have timestamps, so we return overall top books
    
    # Get books with most reads/ratings
    top_books = db.query(
        Book.id,
        Book.title,
        Book.author,
        Book.genre,
        Book.description,
        Book.cover_image,
        func.count(UserBook.id).label('read_count'),
        func.avg(UserBook.rating).label('avg_rating')
    ).join(
        UserBook, Book.id == UserBook.book_id
    ).group_by(
        Book.id
    ).order_by(
        func.count(UserBook.id).desc()
    ).limit(10).all()
    
    result = []
    for book in top_books:
        result.append({
            "id": book.id,
            "title": book.title,
            "author": clean_brackets(book.author),
            "genre": clean_brackets(book.genre),
            "description": book.description,
            "cover_image": book.cover_image,
            "rating": round(float(book.avg_rating), 1) if book.avg_rating else 0.0
        })
    
    return result

@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    """Delete a book from the database"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Delete the book
    db.delete(book)
    db.commit()
    
    return {"message": "Book deleted successfully"}
