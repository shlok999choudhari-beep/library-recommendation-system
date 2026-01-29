from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.database import get_db
from app.models import UserBook, User, Book, UserPreference
from pydantic import BaseModel
from datetime import datetime
import json

class NameUpdate(BaseModel):
    name: str

class PreferencesUpdate(BaseModel):
    preferred_genres: list[str]

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/{user_id}/ratings")
def get_user_ratings(user_id: int, db: Session = Depends(get_db)):
    """Get all ratings for a specific user with book titles"""
    ratings = db.query(UserBook, Book).join(Book, UserBook.book_id == Book.id).filter(
        UserBook.user_id == user_id
    ).all()
    
    result = {}
    for user_book, book in ratings:
        result[user_book.book_id] = {
            "rating": user_book.rating,
            "status": user_book.status,
            "title": book.title
        }
    
    return result

@router.put("/{user_id}/name")
def update_user_name(user_id: int, name_data: NameUpdate, db: Session = Depends(get_db)):
    """Update user's display name"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.name = name_data.name
    db.commit()
    
    return {"message": "Name updated successfully"}

@router.get("/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    """Get user reading statistics"""
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    # Count books read this month (status = 'read')
    books_this_month = db.query(UserBook).filter(
        UserBook.user_id == user_id,
        UserBook.status == 'read'
    ).count()
    
    # Total books read
    total_books_read = db.query(UserBook).filter(
        UserBook.user_id == user_id,
        UserBook.status == 'read'
    ).count()
    
    # Currently reading
    currently_reading = db.query(UserBook).filter(
        UserBook.user_id == user_id,
        UserBook.status == 'reading'
    ).count()
    
    # Wishlist count
    wishlist_count = db.query(UserBook).filter(
        UserBook.user_id == user_id,
        UserBook.status == 'wishlist'
    ).count()
    
    # Get favorite genre
    favorite_genre_query = db.query(Book.genre, func.count(Book.genre).label('count')).join(
        UserBook, Book.id == UserBook.book_id
    ).filter(
        UserBook.user_id == user_id,
        UserBook.status == 'read'
    ).group_by(Book.genre).order_by(func.count(Book.genre).desc()).first()
    
    favorite_genre = favorite_genre_query[0] if favorite_genre_query else "Unknown"
    
    # Calculate user rank based on books read
    user_rank_query = db.query(
        UserBook.user_id,
        func.count(UserBook.book_id).label('books_count')
    ).filter(
        UserBook.status == 'read'
    ).group_by(UserBook.user_id).order_by(func.count(UserBook.book_id).desc()).all()
    
    user_rank = 1
    for i, (uid, count) in enumerate(user_rank_query, 1):
        if uid == user_id:
            user_rank = i
            break
    
    return {
        "books_this_month": books_this_month,
        "total_books_read": total_books_read,
        "currently_reading": currently_reading,
        "wishlist_count": wishlist_count,
        "favorite_genre": favorite_genre,
        "user_rank": user_rank,
        "total_users": len(user_rank_query)
    }

@router.get("/{user_id}/wishlist")
def get_user_wishlist(user_id: int, db: Session = Depends(get_db)):
    """Get user's wishlist books"""
    wishlist = db.query(UserBook, Book).join(Book, UserBook.book_id == Book.id).filter(
        UserBook.user_id == user_id,
        UserBook.status == 'wishlist'
    ).all()
    
    return [{
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "genre": book.genre
    } for _, book in wishlist]

@router.get("/{user_id}/preferences")
def get_user_preferences(user_id: int, db: Session = Depends(get_db)):
    """Get user preferences and onboarding status"""
    prefs = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    if not prefs:
        return {"onboarding_completed": False, "preferred_genres": []}
    
    return {
        "onboarding_completed": prefs.onboarding_completed,
        "preferred_genres": json.loads(prefs.preferred_genres) if prefs.preferred_genres else []
    }

@router.post("/{user_id}/preferences")
def update_user_preferences(user_id: int, prefs_data: PreferencesUpdate, db: Session = Depends(get_db)):
    """Update user preferences and mark onboarding as complete"""
    prefs = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    
    if not prefs:
        prefs = UserPreference(
            user_id=user_id,
            preferred_genres=json.dumps(prefs_data.preferred_genres),
            onboarding_completed=True
        )
        db.add(prefs)
    else:
        prefs.preferred_genres = json.dumps(prefs_data.preferred_genres)
        prefs.onboarding_completed = True
    
    db.commit()
    return {"message": "Preferences updated successfully"}