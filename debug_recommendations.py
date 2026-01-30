import sys
sys.path.insert(0, 'c:/library-recommendation-system/backend')

from app.database import SessionLocal
from app.models import User, Book, UserBook
from sqlalchemy import func

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
            genre = book.genre.strip("[]'\"").split(',')[0].strip("'\"")
            preferred_genres.append(genre)
            print(f"  Liked book: {book.title} - Genre: {genre}")

print(f"\nPreferred genres: {set(preferred_genres)}")

# Get books user has read
read_book_ids = {ub.book_id for ub in user_books}
print(f"User has read {len(read_book_ids)} books")

# Try to get recommendations
query = db.query(
    Book,
    func.coalesce(func.avg(UserBook.rating), 4.0).label('avg_rating')
).outerjoin(
    UserBook, Book.id == UserBook.book_id
).filter(
    ~Book.id.in_(read_book_ids)
).group_by(Book.id)

if preferred_genres:
    print(f"\nFiltering by preferred genres: {set(preferred_genres)}")
    query = query.filter(Book.genre.in_(preferred_genres))

books_with_ratings = query.order_by(
    func.coalesce(func.avg(UserBook.rating), 4.0).desc()
).limit(10).all()

print(f"\nRecommendations found: {len(books_with_ratings)}")
for book, rating in books_with_ratings[:3]:
    print(f"  - {book.title} (Genre: {book.genre}, Rating: {rating})")

db.close()
