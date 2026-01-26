from fastapi import APIRouter

router = APIRouter(prefix="/recommend", tags=["Recommendations"])

@router.get("/{user_id}")
def recommend_books(user_id: int):
    # Temporary rule-based recommendations (ML-ready structure)
    return [
        {
            "title": "Atomic Habits",
            "author": "James Clear",
            "rating": 4.8,
            "genre": "Self Help"
        },
        {
            "title": "The Alchemist",
            "author": "Paulo Coelho",
            "rating": 4.5,
            "genre": "Fiction"
        },
        {
            "title": "Deep Work",
            "author": "Cal Newport",
            "rating": 4.6,
            "genre": "Productivity"
        }
    ]
