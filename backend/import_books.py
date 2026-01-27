import pandas as pd
from sqlalchemy.orm import sessionmaker
from app.database import engine
from app.models import Book

def import_books_from_csv(csv_file_path):
    """Import books from CSV dataset"""
    
    # Create database session
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Read CSV file
        df = pd.read_csv(csv_file_path)
        
        # Expected columns: title, author, genre, description
        # Adjust column names based on your dataset
        required_columns = ['title', 'author']
        
        if not all(col in df.columns for col in required_columns):
            print(f"CSV must have columns: {required_columns}")
            print(f"Found columns: {list(df.columns)}")
            return
        
        # Clean and prepare data
        df = df.fillna('')  # Fill NaN values
        
        books_added = 0
        for _, row in df.iterrows():
            # Check if book already exists
            existing = db.query(Book).filter(
                Book.title == row['title'],
                Book.author == row['author']
            ).first()
            
            if not existing:
                book = Book(
                    title=row['title'],
                    author=row['author'],
                    genre=row.get('genre', ''),
                    description=row.get('description', '')
                )
                db.add(book)
                books_added += 1
        
        db.commit()
        print(f"Successfully imported {books_added} books!")
        
    except Exception as e:
        db.rollback()
        print(f"Error importing books: {e}")
    finally:
        db.close()

def import_books_from_json(json_file_path):
    """Import books from JSON dataset"""
    
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        df = pd.read_json(json_file_path)
        
        books_added = 0
        for _, row in df.iterrows():
            existing = db.query(Book).filter(
                Book.title == row['title'],
                Book.author == row['author']
            ).first()
            
            if not existing:
                book = Book(
                    title=row['title'],
                    author=row['author'],
                    genre=row.get('genre', ''),
                    description=row.get('description', '')
                )
                db.add(book)
                books_added += 1
        
        db.commit()
        print(f"Successfully imported {books_added} books!")
        
    except Exception as e:
        db.rollback()
        print(f"Error importing books: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Example usage:
    # import_books_from_csv("books_dataset.csv")
    # import_books_from_json("books_dataset.json")
    
    print("Import script ready!")
    print("Usage:")
    print("  import_books_from_csv('your_dataset.csv')")
    print("  import_books_from_json('your_dataset.json')")