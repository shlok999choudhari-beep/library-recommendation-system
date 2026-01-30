from app.database import SessionLocal
from app.models import User, Book, UserBook
import random

def add_user_interactions():
    print("Adding user interactions...")
    
    db = SessionLocal()
    
    # Get all users and books
    users = db.query(User).all()
    books = db.query(Book).all()
    
    print(f"Found {len(users)} users and {len(books)} books")
    
    # Generate sample ratings for better recommendations
    for user in users:
        # Each user rates 20-50 random books
        num_ratings = random.randint(20, 50)
        user_books = random.sample(books, min(num_ratings, len(books)))
        
        for book in user_books:
            rating = round(random.uniform(1.0, 5.0), 1)
            interaction = UserBook(
                user_id=user.id,
                book_id=book.id,
                rating=rating,
                status=random.choice(["read", "reading", "wishlist"])
            )
            db.add(interaction)
    
    db.commit()
    db.close()
    
    print("User interactions added successfully!")

if __name__ == "__main__":
    add_user_interactions()