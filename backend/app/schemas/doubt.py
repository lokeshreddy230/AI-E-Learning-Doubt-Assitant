from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime

class DoubtCreate(BaseModel):
    question: str

class DoubtResponse(BaseModel):
    id: int
    user_id: int
    subject: str
    question: str
    ai_response: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class FeedbackCreate(BaseModel):
    rating: int
    comments: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    doubt_id: int
    rating: int
    comments: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
