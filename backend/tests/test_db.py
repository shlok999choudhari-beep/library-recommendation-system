import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal
from app.models import User, Book, UserBook
from app.utils.security import hash_password

# Test database connection
try:
    db = SessionLocal()
    print("Database connection successful")
    
    # Test creating a user
    test_user = User(
        email="test@example.com",
        hashed_password=hash_password("test123"),
        role="user"
    )
    
    # Check if user already exists
    existing = db.query(User).filter(User.email == test_user.email).first()
    if existing:
        print("User query works, test user already exists")
    else:
        db.add(test_user)
        db.commit()
        print("User creation successful")
    
    db.close()
    print("All tests passed")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()