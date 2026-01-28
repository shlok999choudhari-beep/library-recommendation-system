import random
from app.database import SessionLocal
from app.models import UserBook

def update_ratings_to_higher_range():
    db = SessionLocal()
    
    # Get all interactions
    interactions = db.query(UserBook).all()
    print(f"Updating {len(interactions)} ratings...")
    
    # Update each rating to be in range 3.7-4.9
    for interaction in interactions:
        interaction.rating = round(random.uniform(3.7, 4.9), 1)
    
    db.commit()
    
    # Verify average ratings
    from sqlalchemy import text
    avg_ratings = db.execute(text("""
        SELECT AVG(rating) as overall_avg, MIN(rating) as min_rating, MAX(rating) as max_rating
        FROM user_books
    """)).fetchone()
    
    print(f"Overall average rating: {avg_ratings[0]:.2f}")
    print(f"Rating range: {avg_ratings[1]} - {avg_ratings[2]}")
    
    db.close()

if __name__ == "__main__":
    update_ratings_to_higher_range()