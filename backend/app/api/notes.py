from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.models.user import User
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("", response_model=NoteResponse)
def create_note(note_in: NoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_note = Note(
        user_id=current_user.id,
        title=note_in.title,
        content=note_in.content
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@router.get("", response_model=List[NoteResponse])
def get_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notes = db.query(Note).filter(Note.user_id == current_user.id).order_by(Note.created_at.desc()).all()
    return notes

@router.delete("/{id}")
def delete_note(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}
