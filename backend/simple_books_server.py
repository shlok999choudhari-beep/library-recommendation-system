from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import get_db, Base, engine
from app.models import User, Book, UserBook
from app.utils.security import verify_password
from pydantic import BaseModel

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserLogin(BaseModel):
    email: str
    password: str

def clean_brackets(text):
    if not text:
        return text
    cleaned = text.strip("[]'\"")
    if ',' in cleaned:
        cleaned = cleaned.split(',')[0].strip("'\"")
    return cleaned

@app.post("/auth/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not user.hashed_password or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "user_id": user.id,
        "email": user.email,
        "name": user.name or user.email.split('@')[0],
        "role": user.role or "user"
    }

@app.get("/books/")
def get_books(db: Session = Depends(get_db)):
    books = db.query(Book).all()
    result = []
    
    for book in books:
        book_ratings = db.query(UserBook.rating).filter(
            UserBook.book_id == book.id,
            UserBook.rating.isnot(None)
        ).all()
        avg_rating = sum(r[0] for r in book_ratings) / len(book_ratings) if book_ratings else 4.0
        
        result.append({
            "id": book.id,
            "title": book.title,
            "author": clean_brackets(book.author),
            "genre": clean_brackets(book.genre),
            "description": book.description,
            "cover_image": book.cover_image,
            "rating": round(avg_rating, 1)
        })
    
    return result

@app.get("/recommend/{user_id}")
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    books = db.query(Book).limit(10).all()
    result = []
    
    for book in books:
        book_ratings = db.query(UserBook.rating).filter(
            UserBook.book_id == book.id,
            UserBook.rating.isnot(None)
        ).all()
        avg_rating = sum(r[0] for r in book_ratings) / len(book_ratings) if book_ratings else 4.0
        
        result.append({
            "id": book.id,
            "title": book.title,
            "author": clean_brackets(book.author),
            "genre": clean_brackets(book.genre),
            "description": book.description,
            "cover_image": book.cover_image,
            "rating": round(avg_rating, 1)
        })
    
    return result

@app.get("/user/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    return {
        "books_this_month": 5,
        "total_books_read": 25,
        "currently_reading": 3,
        "wishlist_count": 8
    }

@app.get("/user/{user_id}/ratings")
def get_user_ratings(user_id: int, db: Session = Depends(get_db)):
    return {}

@app.get("/books/weekly-top")
def get_weekly_top_books(db: Session = Depends(get_db)):
    books = db.query(Book).limit(5).all()
    return [{"id": b.id, "title": b.title, "author": clean_brackets(b.author), "genre": clean_brackets(b.genre), "rating": 4.5} for b in books]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)