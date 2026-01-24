from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserBook

router = APIRouter(prefix="/activity", tags=["User Activity"])

@router.post("/update")
def update_activity(
    user_id: int,
    book_id: int,
    rating: float,
    status: str,
    db: Session = Depends(get_db)
):
    activity = db.query(UserBook).filter(
        UserBook.user_id == user_id,
        UserBook.book_id == book_id
    ).first()

    if activity:
        activity.rating = rating
        activity.status = status
    else:
        activity = UserBook(
            user_id=user_id,
            book_id=book_id,
            rating=rating,
            status=status
        )
        db.add(activity)

    db.commit()
    db.refresh(activity)
    return activity