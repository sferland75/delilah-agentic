# database/sync_db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# SQLAlchemy model base class
class Base(DeclarativeBase):
    pass

# Construct database URL
DATABASE_URL = "postgresql://delilah:delilah123@db:5432/delilah_db"

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()