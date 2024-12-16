from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    DEBUG: bool = True
    SECRET_KEY: str = "dev-secret-key"
    
    class Config:
        env_file = ".env"

settings = Settings()
