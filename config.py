# app/config.py
from pydantic import BaseModel

class Settings(BaseModel):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:yourpassword@localhost:5432/delilah"

settings = Settings()