from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.models.doubt import Doubt, Feedback
from app.models.user import User
from app.schemas.doubt import DoubtCreate, DoubtResponse, FeedbackCreate, FeedbackResponse
from app.api.deps import get_current_user
from app.services.gemini_service import get_gemini_service, GeminiService
from app.core.rate_limit import limiter

router = APIRouter()

@router.post("/ask", response_model=DoubtResponse)
@limiter.limit("5/minute")
def ask_doubt(
    request: Request,
    doubt_in: DoubtCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Retrieve the Gemini service instance
    gemini = get_gemini_service()
    
    # Call the AI provider
    ai_response = gemini.ask(question=doubt_in.question)
    
    # Store in database
    new_doubt = Doubt(
        user_id=current_user.id,
        subject=ai_response.get("subject", "General Knowledge"),
        question=doubt_in.question,
        ai_response=ai_response
    )
    
    db.add(new_doubt)
    db.commit()
    db.refresh(new_doubt)
    
    return new_doubt

@router.get("/history", response_model=List[DoubtResponse])
def get_doubt_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doubts = db.query(Doubt).filter(Doubt.user_id == current_user.id).order_by(Doubt.created_at.desc()).all()
    return doubts

@router.get("/{id}", response_model=DoubtResponse)
def get_doubt(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doubt = db.query(Doubt).filter(Doubt.id == id, Doubt.user_id == current_user.id).first()
    if not doubt:
        raise HTTPException(status_code=404, detail="Doubt not found")
    return doubt

@router.post("/{id}/feedback", response_model=FeedbackResponse)
def submit_feedback(id: int, feedback_in: FeedbackCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doubt = db.query(Doubt).filter(Doubt.id == id, Doubt.user_id == current_user.id).first()
    if not doubt:
        raise HTTPException(status_code=404, detail="Doubt not found")
    
    # Check if feedback already exists
    existing_feedback = db.query(Feedback).filter(Feedback.doubt_id == id).first()
    if existing_feedback:
        raise HTTPException(status_code=400, detail="Feedback already submitted for this doubt")
        
    new_feedback = Feedback(
        doubt_id=id,
        rating=feedback_in.rating,
        comments=feedback_in.comments
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return new_feedback
