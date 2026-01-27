import random
from app.database import SessionLocal
from app.models import User, Book, UserBook

def generate_users_and_ratings():
    db = SessionLocal()
    
    # Clear existing data
    print("Clearing existing data...")
    db.query(UserBook).delete()
    db.query(User).delete()
    db.commit()
    
    # Create 200 fake users
    print("Creating 200 users...")
    for i in range(200):
        user = User(
            name=f"User{i+1}",
            email=f"user{i+1}@example.com",
            role="user"
        )
        db.add(user)
    
    db.commit()
    
    # Get all users and books
    users = db.query(User).all()
    books = db.query(Book).all()
    
    print(f"Total users: {len(users)}, Total books: {len(books)}")
    
    # Clear existing interactions
    db.query(UserBook).delete()
    
    # Each user rates 50-150 random books
    print("Generating ratings...")
    for user in users:
        num_ratings = random.randint(50, 150)
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
    
    # Calculate and display average ratings
    print("Calculating average ratings...")
    from sqlalchemy import text
    avg_ratings = db.execute(text("""
        SELECT book_id, AVG(rating) as avg_rating, COUNT(*) as rating_count
        FROM user_books 
        GROUP BY book_id
    """)).fetchall()
    
    print(f"Generated ratings for {len(avg_ratings)} books")
    print("Sample average ratings:")
    for i, (book_id, avg_rating, count) in enumerate(avg_ratings[:5]):
        book = db.query(Book).filter(Book.id == book_id).first()
        print(f"  {book.title}: {avg_rating:.1f} stars ({count} ratings)")
    
    total_interactions = db.query(UserBook).count()
    print(f"Total interactions: {total_interactions}")
    
    db.close()

if __name__ == "__main__":
    generate_users_and_ratings()