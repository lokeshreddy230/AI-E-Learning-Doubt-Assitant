import os
import sys

# Add the backend directory to sys.path so we can import from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.db import SessionLocal
from app.models.user import User, UserRole
from app.models.doubt import Doubt, Feedback
from app.models.note import Note
from app.models.login_log import LoginLog
from app.core.security import get_password_hash

def create_admin_user():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.email == "admin@eduai.com").first()
        if admin:
            print("Admin user already exists!")
            return

        new_admin = User(
            full_name="Platform Admin",
            email="admin@eduai.com",
            password_hash=get_password_hash("AdminPassword123!"),
            role=UserRole.admin
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        print("Successfully created admin user!")
        print("Email: admin@eduai.com")
        print("Password: AdminPassword123!")
    except Exception as e:
        print(f"Error creating admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
