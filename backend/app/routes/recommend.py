from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Book, UserBook
from recommender.engine import hybrid_recommendation
import pandas as pd

router = APIRouter(prefix="/recommend", tags=["Recommendations"])


@router.get("/{user_id}")
def recommend(user_id: int, db: Session = Depends(get_db)):
    users = pd.read_sql(db.query(User).statement, db.bind)
    books = pd.read_sql(db.query(Book).statement, db.bind)
    interactions = pd.read_sql(db.query(UserBook).statement, db.bind)

    if books.empty:
        return []

    result = hybrid_recommendation(
        user_id=user_id,
        users_df=users,
        books_df=books,
        interactions_df=interactions
    )

    return result[["id", "title", "author", "genre"]].to_dict(orient="records")
