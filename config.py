from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/delilah"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    
    # Application settings
    DEBUG: bool = True
    APP_NAME: str = "Delilah Agentic"
    API_V1_STR: str = "/api/v1"
    
    # Redis settings
    REDIS_URL: str = "redis://localhost:6379"
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Environment
    APP_ENV: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
