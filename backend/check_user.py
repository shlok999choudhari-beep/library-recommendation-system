from app.database import SessionLocal
from app.models import User
from app.utils.security import hash_password

def check_and_create_user():
    db = SessionLocal()
    
    # Check if user exists
    user = db.query(User).filter(User.email == "shlok@example.com").first()
    
    if user:
        print(f"User found: {user.email}, Name: {user.name}")
        print(f"Has password: {user.hashed_password is not None}")
        print(f"Role: {user.role}")
    else:
        print("User not found. Creating user...")
        new_user = User(
            name="Shlok",
            email="shlok@example.com",
            hashed_password=hash_password("Shlok@999"),
            role="user"
        )
        db.add(new_user)
        db.commit()
        print("User created successfully!")
    
    db.close()

if __name__ == "__main__":
    check_and_create_user()