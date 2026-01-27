from app.database import SessionLocal
from app.models import Book

def add_sample_books():
    db = SessionLocal()
    
    sample_books = [
        {
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "genre": "Fiction",
            "description": "A gripping tale of racial injustice and childhood innocence in the American South"
        },
        {
            "title": "1984",
            "author": "George Orwell",
            "genre": "Dystopian",
            "description": "A dystopian social science fiction novel about totalitarian control"
        },
        {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "genre": "Fiction",
            "description": "A classic American novel about the Jazz Age and the American Dream"
        },
        {
            "title": "Pride and Prejudice",
            "author": "Jane Austen",
            "genre": "Romance",
            "description": "A romantic novel about manners, upbringing, and marriage in Georgian England"
        },
        {
            "title": "The Catcher in the Rye",
            "author": "J.D. Salinger",
            "genre": "Fiction",
            "description": "A controversial novel about teenage rebellion and alienation"
        },
        {
            "title": "Lord of the Flies",
            "author": "William Golding",
            "genre": "Fiction",
            "description": "A novel about British boys stranded on an uninhabited island"
        },
        {
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "genre": "Fantasy",
            "description": "A fantasy adventure about Bilbo Baggins and his unexpected journey"
        },
        {
            "title": "Fahrenheit 451",
            "author": "Ray Bradbury",
            "genre": "Science Fiction",
            "description": "A dystopian novel about a future where books are banned and burned"
        },
        {
            "title": "Jane Eyre",
            "author": "Charlotte Bronte",
            "genre": "Romance",
            "description": "A novel about an orphaned girl who becomes a governess"
        },
        {
            "title": "The Lord of the Rings",
            "author": "J.R.R. Tolkien",
            "genre": "Fantasy",
            "description": "An epic fantasy adventure about the quest to destroy the One Ring"
        }
    ]
    
    try:
        books_added = 0
        for book_data in sample_books:
            # Check if book already exists
            existing = db.query(Book).filter(
                Book.title == book_data["title"],
                Book.author == book_data["author"]
            ).first()
            
            if not existing:
                book = Book(**book_data)
                db.add(book)
                books_added += 1
        
        db.commit()
        print(f"Successfully added {books_added} sample books!")
        
        # Show all books
        all_books = db.query(Book).all()
        print(f"\nTotal books in database: {len(all_books)}")
        for book in all_books:
            print(f"- {book.title} by {book.author}")
            
    except Exception as e:
        db.rollback()
        print(f"Error adding books: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    add_sample_books()