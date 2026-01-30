from app.database import SessionLocal
from app.models import User, Book, UserBook
from app.utils.security import hash_password
import random

def create_fake_users_and_ratings():
    print("Creating 200 fake users with comprehensive book ratings...")
    
    db = SessionLocal()
    
    # Clear existing data
    db.query(UserBook).delete()
    db.query(User).filter(User.email.notlike('%@example.com')).delete()
    
    # Get all books
    books = db.query(Book).all()
    print(f"Found {len(books)} books")
    
    # Create 200 fake users
    fake_users = []
    for i in range(1, 201):
        user = User(
            name=f"User{i}",
            email=f"user{i}@fake.com",
            hashed_password=hash_password("password123"),
            role="user"
        )
        db.add(user)
        fake_users.append(user)
    
    db.commit()
    
    # Refresh to get user IDs
    for user in fake_users:
        db.refresh(user)
    
    print(f"Created {len(fake_users)} fake users")
    
    # Make each user rate ALL books with ratings between 3.7 and 5.0
    total_ratings = 0
    for user in fake_users:
        for book in books:
            rating = round(random.uniform(3.7, 5.0), 1)
            interaction = UserBook(
                user_id=user.id,
                book_id=book.id,
                rating=rating,
                status="read"  # All books are marked as read
            )
            db.add(interaction)
            total_ratings += 1
        
        if user.id % 20 == 0:  # Progress update every 20 users
            print(f"Processed {user.id} users...")
    
    db.commit()
    db.close()
    
    print(f"Successfully created {total_ratings} ratings!")
    print(f"Each user rated all {len(books)} books")
    print("All ratings are between 3.7 and 5.0")

if __name__ == "__main__":
    create_fake_users_and_ratings()