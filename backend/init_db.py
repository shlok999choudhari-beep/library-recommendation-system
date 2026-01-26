from app.database import Base, engine
from app.models import User, Book, UserBook

def init_database():
    """Initialize the database with all tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_database()