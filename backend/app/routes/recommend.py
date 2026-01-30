from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import pandas as pd
from ..database import get_db
from ..models import Book, User, UserBook, UserPreferences
from ..recommender.engine import hybrid_recommendation
import traceback
import json

def clean_brackets(text):
    """Remove square brackets and quotes from text fields"""
    if not text:
        return text
    # Remove square brackets and quotes
    cleaned = text.strip("[]'\"")
    # If it contains comma-separated values, take the first one
    if ',' in cleaned:
        cleaned = cleaned.split(',')[0].strip("'\"")
    return cleaned

router = APIRouter(prefix="/recommend", tags=["Recommendations"])

@router.get("/{user_id}")
def recommend_books(user_id: int, db: Session = Depends(get_db)):
    try:
        # Check if user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get user's reading history
        user_books = db.query(UserBook).filter(UserBook.user_id == user_id).all()
        
        if not user_books:
            # Return popular books for new users with optimized rating query
            books_with_ratings = db.query(
                Book,
                func.coalesce(func.avg(UserBook.rating), 4.0).label('avg_rating')
            ).outerjoin(
                UserBook, Book.id == UserBook.book_id
            ).group_by(Book.id).order_by(
                func.coalesce(func.avg(UserBook.rating), 4.0).desc()
            ).limit(10).all()
        else:
            # Get user's preferred genres from highly rated books
            preferred_genres = []
            for ub in user_books:
                if ub.rating and ub.rating >= 4.0:
                    book = db.query(Book).filter(Book.id == ub.book_id).first()
                    if book and book.genre:
                        preferred_genres.append(clean_brackets(book.genre))
            
            # Get books from preferred genres that user hasn't read
            read_book_ids = {ub.book_id for ub in user_books}
            
            # Optimized query with ratings
            query = db.query(
                Book,
                func.coalesce(func.avg(UserBook.rating), 4.0).label('avg_rating')
            ).outerjoin(
                UserBook, Book.id == UserBook.book_id
            ).filter(
                ~Book.id.in_(read_book_ids)
            ).group_by(Book.id)
            
            # Try with preferred genres first, but don't make it too restrictive
            if preferred_genres and len(preferred_genres) > 0:
                # Use LIKE for more flexible genre matching
                genre_filters = []
                for genre in set(preferred_genres):  # Use set to avoid duplicates
                    genre_filters.append(Book.genre.like(f'%{genre}%'))
                
                # Try to get books from preferred genres
                from sqlalchemy import or_
                genre_query = query.filter(or_(*genre_filters))
                books_with_ratings = genre_query.order_by(
                    func.coalesce(func.avg(UserBook.rating), 4.0).desc()
                ).limit(10).all()
                
                # If no books found with preferred genres, fall back to all books
                if not books_with_ratings:
                    books_with_ratings = query.order_by(
                        func.coalesce(func.avg(UserBook.rating), 4.0).desc()
                    ).limit(10).all()
            else:
                # No preferred genres, return top rated books
                books_with_ratings = query.order_by(
                    func.coalesce(func.avg(UserBook.rating), 4.0).desc()
                ).limit(10).all()
        
        result = []
        for book, avg_rating in books_with_ratings:
            result.append({
                "id": book.id,
                "title": book.title,
                "author": clean_brackets(book.author),
                "rating": round(float(avg_rating), 1),
                "genre": clean_brackets(book.genre),
                "description": book.description,
                "cover_image": book.cover_image
            })
        return result
        
    except Exception as e:
        print(f"Recommendation error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Unable to fetch recommendations")
