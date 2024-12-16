from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.core.config import settings

# Create engine for database
engine = create_engine(settings.DATABASE_URL)

# Create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)