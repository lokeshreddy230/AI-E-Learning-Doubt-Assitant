import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.db import SessionLocal
from app.models.user import User
from app.core.security import verify_password

def test():
    db = SessionLocal()
    admin = db.query(User).filter(User.email == "admin@eduai.com").first()
    if admin:
        print(f"Admin found! Hash: {admin.password_hash}")
        is_valid = verify_password("AdminPassword123!", admin.password_hash)
        print(f"Password Valid? {is_valid}")
    else:
        print("Admin NOT found!")
    db.close()

if __name__ == "__main__":
    test()
