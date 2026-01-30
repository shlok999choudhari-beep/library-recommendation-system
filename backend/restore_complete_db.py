from app.database import Base, engine, SessionLocal
from app.models import User, Book, UserBook
from app.utils.security import hash_password
from import_books import import_books_from_csv
import random

def restore_complete_database():
    print("Restoring complete database...")
    
    # 1. Initialize all database tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # 2. Import books from CSV
    print("Importing 1500 books...")
    import_books_from_csv("books_1500_real_descriptions.csv")
    
    # 3. Create sample users
    print("Creating sample users...")
    db = SessionLocal()
    
    # Create your main user
    main_user = User(
        name="Shlok",
        email="shlok@example.com",
        hashed_password=hash_password("Shlok@999"),
        role="user"
    )
    db.add(main_user)
    
    # Create admin user
    admin_user = User(
        name="Admin",
        email="admin@example.com",
        hashed_password=hash_password("admin123"),
        role="admin"
    )
    db.add(admin_user)
    
    # Create 50 sample users for recommendations
    for i in range(1, 51):
        user = User(
            name=f"User{i}",
            email=f"user{i}@example.com",
            hashed_password=hash_password("password123"),
            role="user"
        )
        db.add(user)
    
    db.commit()
    
    # 4. Generate sample ratings for better recommendations
    print("Generating sample ratings...")
    users = db.query(User).all()
    books = db.query(Book).all()
    
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
    
    print("Database restoration complete!")
    print("Database contains:")
    print(f"   - {len(users)} users")
    print(f"   - 1500 books")
    print(f"   - Sample ratings and interactions")
    print("\nLogin credentials:")
    print("   Main user: shlok@example.com / Shlok@999")
    print("   Admin: admin@example.com / admin123")

if __name__ == "__main__":
    restore_complete_database()