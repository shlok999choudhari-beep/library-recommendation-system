from import_books import import_books_from_csv
from app.database import Base, engine

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Import books from CSV
import_books_from_csv("books_1500_real_descriptions.csv")