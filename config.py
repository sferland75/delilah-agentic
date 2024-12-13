from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://sferl:4Leafclover!@localhost:5432/delilah"
    
    # Application
    DEBUG: bool = True
    APP_NAME: str = "Delilah Agentic"
    API_V1_STR: str = "/api/v1"
    APP_ENV: str = "development"
    
    # Optional settings
    REDIS_URL: Optional[str] = None
    RATE_LIMIT_PER_MINUTE: Optional[int] = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"

settings = Settings()
