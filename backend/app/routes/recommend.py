from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
from ..database import get_db
from ..models import Book, User, UserBook, UserPreference
from ..recommender.engine import hybrid_recommendation
import traceback
import json

router = APIRouter(prefix="/recommend", tags=["Recommendations"])

@router.get("/{user_id}")
def recommend_books(user_id: int, db: Session = Depends(get_db)):
    try:
        # Check if user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if user has preferences but no interactions (first-time user)
        user_interactions = db.query(UserBook).filter(UserBook.user_id == user_id).count()
        user_prefs = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
        
        if user_interactions == 0 and user_prefs and user_prefs.preferred_genres:
            # First-time user with preferences - recommend based on genres and similar users
            preferred_genres = json.loads(user_prefs.preferred_genres)
            
            # Find users with similar genre preferences
            similar_users = db.query(UserPreference).filter(
                UserPreference.user_id != user_id,
                UserPreference.preferred_genres.isnot(None)
            ).all()
            
            similar_user_ids = []
            for other_user in similar_users:
                other_genres = json.loads(other_user.preferred_genres)
                # Check if they have at least 2 genres in common
                common_genres = set(preferred_genres) & set(other_genres)
                if len(common_genres) >= 2:
                    similar_user_ids.append(other_user.user_id)
            
            # Get highly rated books from similar users in preferred genres
            if similar_user_ids:
                books = db.query(Book).join(UserBook).filter(
                    UserBook.user_id.in_(similar_user_ids),
                    UserBook.rating >= 4.0,
                    Book.genre.in_(preferred_genres)
                ).distinct().limit(10).all()
            else:
                # Fallback to genre-based recommendations
                books = db.query(Book).filter(Book.genre.in_(preferred_genres)).limit(10).all()
            
            result = []
            for book in books:
                book_ratings = db.query(UserBook.rating).filter(UserBook.book_id == book.id).all()
                avg_rating = sum(r[0] for r in book_ratings) / len(book_ratings) if book_ratings else 0.0
                
                result.append({
                    "id": book.id,
                    "title": book.title,
                    "author": book.author,
                    "rating": round(avg_rating, 1),
                    "genre": book.genre,
                    "description": book.description,
                    "cover_image": book.cover_image
                })
            return result
        
        # Get all books
        books = db.query(Book).all()
        if not books:
            return []
        
        # Get all users and interactions
        users = db.query(User).all()
        interactions = db.query(UserBook).all()
        
        # Convert to DataFrames
        books_df = pd.DataFrame([
            {
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "genre": book.genre,
                "description": book.description,
                "cover_image": book.cover_image,
                "rating": 0.0  # Default rating since not in database
            }
            for book in books
        ])
        
        users_df = pd.DataFrame([
            {"id": user.id, "username": user.name or user.email or f"user_{user.id}"}
            for user in users
        ])
        
        interactions_df = pd.DataFrame([
            {
                "user_id": activity.user_id,
                "book_id": activity.book_id,
                "rating": activity.rating or 3.0  # Default rating if none
            }
            for activity in interactions
        ])
        
        # Get recommendations using hybrid engine
        recommendations = hybrid_recommendation(
            user_id, users_df, books_df, interactions_df
        )
        
        # Convert to response format with average ratings
        result = []
        for _, row in recommendations.iterrows():
            # Calculate average rating for this book
            book_ratings = db.query(UserBook.rating).filter(UserBook.book_id == row["id"]).all()
            avg_rating = sum(r[0] for r in book_ratings) / len(book_ratings) if book_ratings else 0.0
            
            result.append({
                "id": int(row["id"]),
                "title": row["title"],
                "author": row["author"],
                "rating": round(avg_rating, 1),
                "genre": row["genre"],
                "description": row["description"],
                "cover_image": row.get("cover_image")
            })
        
        return result
    except Exception as e:
        print(f"Recommendation error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        
        # Return fallback recommendations from database with average ratings
        try:
            books = db.query(Book).limit(10).all()
            result = []
            for book in books:
                # Calculate average rating
                book_ratings = db.query(UserBook.rating).filter(UserBook.book_id == book.id).all()
                avg_rating = sum(r[0] for r in book_ratings) / len(book_ratings) if book_ratings else 0.0
                
                result.append({
                    "id": book.id,
                    "title": book.title,
                    "author": book.author,
                    "rating": round(avg_rating, 1),
                    "genre": book.genre,
                    "description": book.description,
                    "cover_image": book.cover_image
                })
            return result
        except Exception as fallback_error:
            print(f"Fallback error: {str(fallback_error)}")
            raise HTTPException(status_code=500, detail="Unable to fetch recommendations")