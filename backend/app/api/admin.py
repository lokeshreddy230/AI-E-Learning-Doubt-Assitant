from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.database.db import get_db
from app.models.user import User
from app.models.doubt import Doubt, Feedback
from app.models.note import Note
from app.schemas.user import UserResponse
from app.api.deps import get_current_admin

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin)):
    return db.query(User).all()

@router.get("/statistics")
def get_global_statistics(db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin)):
    total_users = db.query(User).count()
    total_doubts = db.query(Doubt).count()
    total_notes = db.query(Note).count()
    
    return {
        "total_users": total_users,
        "total_doubts": total_doubts,
        "total_notes": total_notes,
        "platform_health": "Optimal",
        "active_users_today": total_users # Simplified
    }

@router.get("/topics")
def get_most_asked_topics(db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin)):
    topics = db.query(Doubt.subject, func.count(Doubt.id)).group_by(Doubt.subject).order_by(func.count(Doubt.id).desc()).limit(5).all()
    return [{"subject": t[0], "count": t[1]} for t in topics]

@router.get("/feedback")
def get_feedback_reports(db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin)):
    feedbacks = db.query(Feedback, Doubt, User).join(Doubt, Feedback.doubt_id == Doubt.id).join(User, Doubt.user_id == User.id).order_by(Feedback.created_at.desc()).limit(50).all()
    return [
        {
            "id": f.Feedback.id,
            "rating": f.Feedback.rating,
            "comments": f.Feedback.comments,
            "question": f.Doubt.question,
            "subject": f.Doubt.subject,
            "student_name": f.User.full_name,
            "student_email": f.User.email,
            "created_at": f.Feedback.created_at
        } for f in feedbacks
    ]
