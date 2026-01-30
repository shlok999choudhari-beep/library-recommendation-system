from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.database import SessionLocal
from app.models import User
from app.utils.security import verify_password

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/auth/login")
def login(credentials: UserLogin):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == credentials.email).first()
        if not user or not user.hashed_password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        if not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "user_id": user.id,
            "email": user.email,
            "name": user.name or user.email.split('@')[0],
            "role": user.role or "user"
        }
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Auth server running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)