from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "user"
    admin_pin: str = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str