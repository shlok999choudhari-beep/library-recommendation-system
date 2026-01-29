from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ChatHistory, Book, User
from pydantic import BaseModel
import google.generativeai as genai
import os
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

class ChatMessage(BaseModel):
    user_id: int
    message: str

router = APIRouter(prefix="/chat", tags=["Chatbot"])

# Configure Gemini API
try:
    genai.configure(api_key="AIzaSyDMGSgt4ckP6RcqxInsNFGw88OFYC-gH74")
    model = genai.GenerativeModel('gemini-2.5-flash')
except Exception as e:
    print(f"Gemini configuration error: {e}")
    model = None

@router.post("/")
def chat_with_bot(chat_data: ChatMessage, db: Session = Depends(get_db)):
    """Chat with AI assistant about books"""
    if not model:
        return {"response": "AI service is currently unavailable. Please try again later."}
        
    try:
        # Get user's name
        user = db.query(User).filter(User.id == chat_data.user_id).first()
        user_name = user.name if user and user.name else "there"
        
        # Simple response without complex context for testing
        prompt = f"""You are a helpful librarian assistant. Always address the user by their name: {user_name}. 
        Give short, concise answers (2-3 sentences max). Keep responses brief and friendly. 
        Question: {chat_data.message}"""
        
        response = model.generate_content(prompt)
        bot_response = response.text if response and response.text else "I couldn't generate a response."
        
        # Truncate if still too long
        if len(bot_response) > 300:
            bot_response = bot_response[:300] + "..."
        
        # Save chat history
        chat_history = ChatHistory(
            user_id=chat_data.user_id,
            message=chat_data.message,
            response=bot_response
        )
        db.add(chat_history)
        db.commit()
        
        return {"response": bot_response}
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return {"response": "I'm experiencing technical difficulties. Please try again later."}

@router.delete("/{user_id}/history")
def clear_chat_history(user_id: int, db: Session = Depends(get_db)):
    """Clear user's chat history"""
    db.query(ChatHistory).filter(ChatHistory.user_id == user_id).delete()
    db.commit()
    return {"message": "Chat history cleared"}

@router.get("/{user_id}/history")
def get_chat_history(user_id: int, db: Session = Depends(get_db)):
    """Get user's chat history"""
    history = db.query(ChatHistory).filter(
        ChatHistory.user_id == user_id
    ).order_by(ChatHistory.timestamp.desc()).limit(10).all()
    
    return [{"message": h.message, "response": h.response, "timestamp": h.timestamp} for h in history]