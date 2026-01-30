from app.database import SessionLocal
from app.models import User
from app.utils.security import verify_password

def test_login():
    db = SessionLocal()
    
    # Test user credentials
    email = "subhi@example.com"
    password = "password123"
    
    user = db.query(User).filter(User.email == email).first()
    
    if user:
        print(f"User found: {user.email}")
        print(f"Has password: {user.hashed_password is not None}")
        
        if user.hashed_password:
            is_valid = verify_password(password, user.hashed_password)
            print(f"Password valid: {is_valid}")
            
            if is_valid:
                print("Login would succeed!")
                print(f"User data: {{'user_id': {user.id}, 'email': '{user.email}', 'name': '{user.name}', 'role': '{user.role or 'user'}'}}")
        else:
            print("No password set")
    else:
        print("User not found")
    
    db.close()

if __name__ == "__main__":
    test_login()