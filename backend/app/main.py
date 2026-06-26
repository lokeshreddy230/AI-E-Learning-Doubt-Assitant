from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.api import auth, doubts, notes, analytics, admin
from app.core.rate_limit import limiter

# Import all models to ensure they are registered with SQLAlchemy
from app.models.user import User
from app.models.doubt import Doubt, Feedback
from app.models.note import Note
from app.models.login_log import LoginLog

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for EduAI E-Learning platform",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # React Dev Server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(doubts.router, prefix="/api/doubts", tags=["Doubts"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

# Ensure uploads directory exists
os.makedirs("uploads/profiles", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to the EduAI Backend API. Visit /docs for the swagger UI."}

# Add rate limit to specific sensitive routes via middleware or dependency if needed, 
# but slowapi allows decorator @limiter.limit("5/minute") on specific endpoints.
