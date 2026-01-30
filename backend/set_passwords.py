from app.database import SessionLocal
from app.models import User
from app.utils.security import hash_password

def set_user_passwords():
    db = SessionLocal()
    
    # Set password for subhi
    subhi = db.query(User).filter(User.email == "subhi@example.com").first()
    if subhi:
        subhi.hashed_password = hash_password("password123")
        print("Set password for subhi@example.com: password123")
    
    # Set password for shlok
    shlok = db.query(User).filter(User.email == "shlok@example.com").first()
    if shlok:
        shlok.hashed_password = hash_password("password123")
        print("Set password for shlok@example.com: password123")
    
    db.commit()
    db.close()
    print("Passwords set successfully!")

if __name__ == "__main__":
    set_user_passwords()