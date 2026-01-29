from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import BookIssue, Book, User, Notification, BookRequest
from pydantic import BaseModel
from datetime import datetime, timedelta

class IssueBook(BaseModel):
    user_id: int
    book_id: int

class RequestBook(BaseModel):
    user_id: int
    book_title: str
    author: str

router = APIRouter(prefix="/library", tags=["Library Management"])

@router.post("/issue")
def request_book_issue(issue_data: IssueBook, db: Session = Depends(get_db)):
    """Request a book issue (requires admin approval)"""
    # Check if book exists
    book = db.query(Book).filter(Book.id == issue_data.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if book is already issued
    existing_issue = db.query(BookIssue).filter(
        BookIssue.book_id == issue_data.book_id,
        BookIssue.status.in_(["issued", "pending"])
    ).first()
    if existing_issue:
        raise HTTPException(status_code=400, detail="Book already issued or pending approval")
    
    # Create pending issue request
    book_issue = BookIssue(
        user_id=issue_data.user_id,
        book_id=issue_data.book_id,
        issue_date=datetime.now(),
        due_date=datetime.now() + timedelta(days=14),
        status="pending"
    )
    db.add(book_issue)
    db.commit()
    
    return {"message": "Book issue request submitted. Waiting for admin approval."}

@router.post("/approve/{issue_id}")
def approve_book_issue(issue_id: int, db: Session = Depends(get_db)):
    """Approve a book issue request (admin only)"""
    book_issue = db.query(BookIssue).filter(BookIssue.id == issue_id).first()
    if not book_issue:
        raise HTTPException(status_code=404, detail="Issue request not found")
    
    if book_issue.status != "pending":
        raise HTTPException(status_code=400, detail="Request is not pending")
    
    book_issue.status = "issued"
    db.commit()
    
    return {"message": "Book issue approved"}

@router.get("/pending-requests")
def get_pending_requests(db: Session = Depends(get_db)):
    """Get all pending book issue requests (admin only)"""
    pending_requests = db.query(BookIssue, Book, User).join(
        Book, BookIssue.book_id == Book.id
    ).join(
        User, BookIssue.user_id == User.id
    ).filter(
        BookIssue.status == "pending"
    ).all()
    
    result = []
    for issue, book, user in pending_requests:
        result.append({
            "issue_id": issue.id,
            "book_title": book.title,
            "book_author": book.author,
            "user_name": user.name or user.email,
            "requested_date": issue.issue_date
        })
    
    return result

@router.post("/request-book")
def request_new_book(request_data: RequestBook, db: Session = Depends(get_db)):
    """Request a new book to be added to library"""
    book_request = BookRequest(
        user_id=request_data.user_id,
        book_title=request_data.book_title,
        author=request_data.author,
        status="pending"
    )
    db.add(book_request)
    db.commit()
    
    return {"message": "Book request submitted successfully"}

@router.get("/book-requests")
def get_book_requests(db: Session = Depends(get_db)):
    """Get all pending book requests (admin only)"""
    requests = db.query(BookRequest, User).join(
        User, BookRequest.user_id == User.id
    ).filter(
        BookRequest.status == "pending"
    ).all()
    
    result = []
    for request, user in requests:
        result.append({
            "request_id": request.id,
            "book_title": request.book_title,
            "author": request.author,
            "user_name": user.name or user.email,
            "requested_date": request.requested_at
        })
    
    return result

@router.post("/return/{issue_id}")
def return_book(issue_id: int, db: Session = Depends(get_db)):
    """Return a book"""
    book_issue = db.query(BookIssue).filter(BookIssue.id == issue_id).first()
    if not book_issue:
        raise HTTPException(status_code=404, detail="Issue record not found")
    
    if book_issue.status != "issued":
        raise HTTPException(status_code=400, detail="Book not currently issued")
    
    book_issue.return_date = datetime.now()
    book_issue.status = "returned"
    db.commit()
    
    return {"message": "Book returned successfully"}

@router.get("/{user_id}/issued")
def get_issued_books(user_id: int, db: Session = Depends(get_db)):
    """Get user's issued books"""
    issued_books = db.query(BookIssue, Book).join(Book).filter(
        BookIssue.user_id == user_id,
        BookIssue.status == "issued"
    ).all()
    
    result = []
    for issue, book in issued_books:
        is_overdue = datetime.now() > issue.due_date
        result.append({
            "issue_id": issue.id,
            "book_title": book.title,
            "book_author": book.author,
            "issue_date": issue.issue_date,
            "due_date": issue.due_date,
            "is_overdue": is_overdue,
            "days_overdue": (datetime.now() - issue.due_date).days if is_overdue else 0
        })
    
    return result

@router.get("/{user_id}/notifications")
def get_notifications(user_id: int, db: Session = Depends(get_db)):
    """Get user notifications"""
    notifications = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.read_status == False
    ).order_by(Notification.created_at.desc()).all()
    
    return [{"id": n.id, "message": n.message, "type": n.type, "created_at": n.created_at} for n in notifications]

@router.put("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    """Mark notification as read"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if notification:
        notification.read_status = True
        db.commit()
    return {"message": "Notification marked as read"}