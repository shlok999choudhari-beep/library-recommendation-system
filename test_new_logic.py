import sys
sys.path.insert(0, 'c:/library-recommendation-system/backend')

from app.database import SessionLocal
from app.models import User, Book, UserBook
from sqlalchemy import func, or_

def clean_brackets(text):
    """Remove square brackets and quotes from text fields"""
    if not text:
        return text
    # Remove square brackets and quotes
    cleaned = text.strip("[]'\"")
    # If it contains comma-separated values, take the first one
    if ',' in cleaned:
        cleaned = cleaned.split(',')[0].strip("'\"")
    return cleaned

db = SessionLocal()

user_id = 1

# Check user's reading history
user_books = db.query(UserBook).filter(UserBook.user_id == user_id).all()
print(f"User {user_id} has rated {len(user_books)} books")

# Get preferred genres
preferred_genres = []
for ub in user_books:
    if ub.rating and ub.rating >= 4.0:
        book = db.query(Book).filter(Book.id == ub.book_id).first()
        if book and book.genre:
            genre = clean_brackets(book.genre)
            preferred_genres.append(genre)

print(f"Preferred genres: {set(preferred_genres)}")

# Get books user has read
read_book_ids = {ub.book_id for ub in user_books}

# Build query
query = db.query(
    Book,
    func.coalesce(func.avg(UserBook.rating), 4.0).label('avg_rating')
).outerjoin(
    UserBook, Book.id == UserBook.book_id
).filter(
    ~Book.id.in_(read_book_ids)
).group_by(Book.id)

# Try with preferred genres using LIKE
if preferred_genres and len(preferred_genres) > 0:
    print(f"\nUsing LIKE matching for genres: {set(preferred_genres)}")
    genre_filters = []
    for genre in set(preferred_genres):
        genre_filters.append(Book.genre.like(f'%{genre}%'))
    
    genre_query = query.filter(or_(*genre_filters))
    books_with_ratings = genre_query.order_by(
        func.coalesce(func.avg(UserBook.rating), 4.0).desc()
    ).limit(10).all()
    
    print(f"Books found with genre filter: {len(books_with_ratings)}")
    
    if not books_with_ratings:
        print("No books found with genre filter, trying without filter...")
        books_with_ratings = query.order_by(
            func.coalesce(func.avg(UserBook.rating), 4.0).desc()
        ).limit(10).all()
        print(f"Books found without filter: {len(books_with_ratings)}")
else:
    books_with_ratings = query.order_by(
        func.coalesce(func.avg(UserBook.rating), 4.0).desc()
    ).limit(10).all()
    print(f"Books found (no preferred genres): {len(books_with_ratings)}")

print(f"\nFinal recommendations: {len(books_with_ratings)}")
for i, (book, rating) in enumerate(books_with_ratings[:5], 1):
    print(f"{i}. {book.title}")
    print(f"   Author: {book.author}")
    print(f"   Genre: {book.genre}")
    print(f"   Rating: {rating}")

db.close()
