from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Book
import pandas as pd
import json
from io import StringIO

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/bulk-import")
async def bulk_import_books(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Bulk import books from CSV or JSON file"""
    
    try:
        content = await file.read()
        
        if file.filename.endswith('.csv'):
            # Handle CSV
            df = pd.read_csv(StringIO(content.decode('utf-8')))
        elif file.filename.endswith('.json'):
            # Handle JSON
            data = json.loads(content.decode('utf-8'))
            df = pd.DataFrame(data)
        else:
            return {"error": "Only CSV and JSON files supported"}
        
        # Clean data
        df = df.fillna('')
        
        books_added = 0
        for _, row in df.iterrows():
            # Check if book exists
            existing = db.query(Book).filter(
                Book.title == row['title'],
                Book.author == row['author']
            ).first()
            
            if not existing:
                book = Book(
                    title=row['title'],
                    author=row['author'],
                    genre=row.get('genre', ''),
                    description=row.get('description', '')
                )
                db.add(book)
                books_added += 1
        
        db.commit()
        return {
            "message": f"Successfully imported {books_added} books",
            "total_processed": len(df),
            "books_added": books_added
        }
        
    except Exception as e:
        db.rollback()
        return {"error": f"Import failed: {str(e)}"}