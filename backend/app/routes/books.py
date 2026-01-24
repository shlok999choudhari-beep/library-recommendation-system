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
    return db.query(Book).all()
