from fastapi import FastAPI
from app.database import engine
from app.models import Base
from app.routes.auth import router as auth_router
from app.routes.books import router as books_router
from app.routes.activity import router as activity_router
from app.routes.recommend import router as recommend_router


app = FastAPI(title="Library Recommendation System")

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(books_router)
app.include_router(activity_router)
app.include_router(recommend_router)

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}
