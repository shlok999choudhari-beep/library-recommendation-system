from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Book

router = APIRouter(prefix="/books", tags=["Books"])

@router.post("/add")
def add_book(
    title: str,
    author: str,
    genre: str,
    description: str,
    db: Session = Depends(get_db)
):
    book = Book(
        title=title,
        author=author,
        genre=genre,
        description=description
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
            "rating": round(avg_rating, 1)
        })
    
    return result
