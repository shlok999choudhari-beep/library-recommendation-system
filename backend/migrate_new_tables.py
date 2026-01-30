from sqlalchemy import create_engine
from app.database import Base
from app.models import *

# Create engine
engine = create_engine("sqlite:///./library.db")

# Create all new tables
# hii
Base.metadata.create_all(bind=engine)

print("✅ All new tables created successfully!")
print("New tables added:")
print("- book_requests")
print("- reviews") 
print("- notifications")
print("- user_preferences")
print("- book_issues")
print("- chat_history")