from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models import Book
from app.routes.auth import router as auth_router
from app.routes.books import router as books_router
from app.routes.activity import router as activity_router
from app.routes.recommend import router as recommend_router
from app.routes.admin import router as admin_router
from app.routes.user import router as user_router
from app.routes.library import router as library_router
from app.routes.chatbot import router as chatbot_router
from fastapi.middleware.cors import CORSMiddleware


try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print("Database not ready yet:", e)


def seed_default_books():
    db: Session = SessionLocal()
    try:
        if db.query(Book).count() > 0:
            return

        default_books = [
            Book(title="The Hobbit", author="J.R.R. Tolkien", genre="Fantasy", description="A classic adventure in Middle-earth."),
            Book(title="1984", author="George Orwell", genre="Dystopian", description="A chilling political dystopia."),
            Book(title="Pride and Prejudice", author="Jane Austen", genre="Romance", description="A witty romance of manners."),
            Book(title="The Da Vinci Code", author="Dan Brown", genre="Mystery", description="A fast-paced thriller with hidden clues."),
            Book(title="Atomic Habits", author="James Clear", genre="Self-Help", description="Practical strategies for building better habits."),
            Book(title="Sapiens", author="Yuval Noah Harari", genre="History", description="A sweeping history of humankind."),
        ]
        db.add_all(default_books)
        db.commit()
        print("Seeded default books into the database.")
    except Exception as e:
        db.rollback()
        print("Failed to seed default books:", e)
    finally:
        db.close()


seed_default_books()


app = FastAPI(title="Library Recommendation System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://library-recommendation-system-nine.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(books_router)
app.include_router(activity_router)
app.include_router(recommend_router)
app.include_router(admin_router)
app.include_router(user_router)
app.include_router(library_router)
app.include_router(chatbot_router)
