import sys
sys.path.insert(0, 'c:/library-recommendation-system/backend')

from app.database import Base, engine, SessionLocal
from app.models import User, Book, UserBook
from app.utils.security import hash_password
import pandas as pd
import random

def restore_database():
    print("="*60)
    print("RESTORING DATABASE")
    print("="*60)
    
    # 1. Create tables
    print("\n[1/4] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created")
    
    db = SessionLocal()
    
    try:
        # 2. Import books
        print("\n[2/4] Importing books from CSV...")
        df = pd.read_csv('c:/library-recommendation-system/backend/books_1500_real_descriptions.csv')
        print(f"   Found {len(df)} books in CSV")
        
        books_added = 0
        for idx, row in df.iterrows():
            book = Book(
                title=str(row['title']),
                author=str(row['author']),
                genre=str(row.get('genre', '')),
                description=str(row.get('description', ''))
            )
            db.add(book)
            books_added += 1
            
            if books_added % 100 == 0:
                print(f"   Imported {books_added} books...")
        
        db.commit()
        print(f"✅ Imported {books_added} books")
        
        # 3. Create users
        print("\n[3/4] Creating users...")
        
        # Main user
        main_user = User(
            name="Shlok",
            email="shlok@example.com",
            hashed_password=hash_password("Shlok@999"),
            role="user"
        )
        db.add(main_user)
        
        # Admin user
        admin_user = User(
            name="Admin",
            email="admin@example.com",
            hashed_password=hash_password("admin123"),
            role="admin"
        )
        db.add(admin_user)
        
        # Sample users
        for i in range(1, 21):  # Create 20 sample users
            user = User(
                name=f"User{i}",
                email=f"user{i}@example.com",
                hashed_password=hash_password("password123"),
                role="user"
            )
            db.add(user)
        
        db.commit()
        print("✅ Created 22 users")
        
        # 4. Generate sample ratings
        print("\n[4/4] Generating sample ratings...")
        users = db.query(User).all()
        books = db.query(Book).all()
        
        ratings_added = 0
        for user in users:
            # Each user rates 15-30 random books
            num_ratings = random.randint(15, 30)
            user_books = random.sample(books, min(num_ratings, len(books)))
            
            for book in user_books:
                rating = round(random.uniform(2.0, 5.0), 1)
                interaction = UserBook(
                    user_id=user.id,
                    book_id=book.id,
                    rating=rating,
                    status=random.choice(["read", "reading", "wishlist"])
                )
                db.add(interaction)
                ratings_added += 1
        
        db.commit()
        print(f"✅ Generated {ratings_added} sample ratings")
        
        print("\n" + "="*60)
        print("DATABASE RESTORATION COMPLETE!")
        print("="*60)
        print(f"\n📊 Database Summary:")
        print(f"   - Users: {len(users)}")
        print(f"   - Books: {len(books)}")
        print(f"   - Ratings: {ratings_added}")
        print(f"\n🔑 Login Credentials:")
        print(f"   Main user: shlok@example.com / Shlok@999")
        print(f"   Admin: admin@example.com / admin123")
        print("\n✅ You can now log in and get recommendations!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    restore_database()
