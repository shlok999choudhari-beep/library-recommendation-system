from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserBook, User
from pydantic import BaseModel

class NameUpdate(BaseModel):
    name: str

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/{user_id}/ratings")
def get_user_ratings(user_id: int, db: Session = Depends(get_db)):
    """Get all ratings for a specific user"""
    ratings = db.query(UserBook).filter(UserBook.user_id == user_id).all()
    
    result = {}
    for rating in ratings:
        result[rating.book_id] = {
            "rating": rating.rating,
            "status": rating.status
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