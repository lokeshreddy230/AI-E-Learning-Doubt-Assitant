from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, func, CheckConstraint
from sqlalchemy.orm import relationship
from app.database.db import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    doubt_id = Column(Integer, ForeignKey("doubts.id", ondelete="CASCADE"), nullable=False, index=True)
    rating = Column(Integer, CheckConstraint('rating >= 1 AND rating <= 5'), nullable=True)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    doubt = relationship("Doubt", back_populates="feedbacks")
