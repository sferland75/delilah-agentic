import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.database import SessionLocal
from api.services.user_service import UserService

def create_admin_user(email: str, password: str, full_name: str):
    db = SessionLocal()
    try:
        user_service = UserService(db)
        user = user_service.create_user(
            email=email,
            password=password,
            full_name=full_name,
            roles=['admin']
        )
        print(f"Admin user created successfully: {user.email}")
    except Exception as e:
        print(f"Error creating admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    email = os.getenv("ADMIN_EMAIL", "admin@delilah-agentic.com")
    password = os.getenv("ADMIN_PASSWORD", "changeme123")
    full_name = os.getenv("ADMIN_NAME", "System Administrator")
    
    create_admin_user(email, password, full_name)