import random
from app.database import SessionLocal
from app.models import User, Book, UserBook

def generate_fake_interactions():
    db = SessionLocal()
    
    # Get all users and books
    users = db.query(User).all()
    books = db.query(Book).all()
    
    print(f"Found {len(users)} users and {len(books)} books")
    
    # Clear existing interactions
    db.query(UserBook).delete()
    
    # Generate random interactions for each user
    for user in users:
        # Each user reads 5-15 random books
        num_books = random.randint(5, 15)
        user_books = random.sample(books, min(num_books, len(books)))
        
        for book in user_books:
            interaction = UserBook(
                user_id=user.id,
                book_id=book.id,
                rating=random.uniform(1.0, 5.0),  # Random rating 1-5
                status=random.choice(["read", "reading", "wishlist"])
            )
            db.add(interaction)
    
    db.commit()
    
    # Show results
    total_interactions = db.query(UserBook).count()
    print(f"Generated {total_interactions} fake interactions")
    
    db.close()

if __name__ == "__main__":
    generate_fake_interactions()