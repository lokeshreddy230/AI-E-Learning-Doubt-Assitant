from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database.db import get_db
from app.models.user import User
from app.models.doubt import Doubt
from app.models.note import Note
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/student")
def get_student_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Calculate mock or simple analytics based on doubts and notes
    total_doubts = db.query(Doubt).filter(Doubt.user_id == current_user.id).count()
    total_notes = db.query(Note).filter(Note.user_id == current_user.id).count()
    
    # Get subjects where doubts were asked
    subjects = db.query(Doubt.subject, func.count(Doubt.id)).filter(
        Doubt.user_id == current_user.id
    ).group_by(Doubt.subject).all()
    
    subject_breakdown = [{"subject": s[0], "count": s[1]} for s in subjects]
    
    learning_score = (total_doubts * 50) + (total_notes * 20)
    monthly_progress = min(100, total_doubts * 10)
    
    # Calculate weekly activity
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    from sqlalchemy import cast, Date
    weekly_doubts = db.query(
        cast(Doubt.created_at, Date).label('date'), 
        func.count(Doubt.id).label('count')
    ).filter(
        Doubt.user_id == current_user.id,
        Doubt.created_at >= seven_days_ago
    ).group_by(
        cast(Doubt.created_at, Date)
    ).all()

    doubts_by_date = {str(d.date): d.count for d in weekly_doubts}
    weekly_activity = []
    for i in range(6, -1, -1):
        day_date = (datetime.utcnow() - timedelta(days=i)).date()
        day_name = day_date.strftime("%a")
        weekly_activity.append({
            "name": day_name,
            "interactions": doubts_by_date.get(str(day_date), 0)
        })
    
    return {
        "total_doubts_resolved": total_doubts,
        "total_notes_saved": total_notes,
        "subject_breakdown": subject_breakdown,
        "monthly_progress": monthly_progress,
        "learning_score": learning_score,
        "weekly_activity": weekly_activity
    }

@router.get("/admin")
def get_admin_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # We could restrict this to admin only, but since there's an /admin router, 
    # we'll keep this endpoint minimal or redirect logic to /admin/statistics
    return {"message": "Use /api/admin/statistics instead"}
