import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.db import engine, Base
from app.models.user import User
from app.models.doubt import Doubt, Feedback
from app.models.note import Note
from app.models.login_log import LoginLog

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
