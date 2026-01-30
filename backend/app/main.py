from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes.auth import router as auth_router
from app.routes.books import router as books_router
from app.routes.activity import router as activity_router
from app.routes.recommend import router as recommend_router
from app.routes.admin import router as admin_router
from app.routes.user import router as user_router
from app.routes.library import router as library_router
from app.routes.chatbot import router as chatbot_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Library Recommendation System")

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