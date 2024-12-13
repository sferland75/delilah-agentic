from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from functools import lru_cache

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    
    # Application settings
    DEBUG: bool = False
    APP_NAME: str = "Delilah Agentic"
    API_V1_STR: str = "/api/v1"
    
    # Redis settings
    REDIS_URL: str = "redis://localhost:6379"
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Environment
    APP_ENV: str = "development"

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra='allow'
    )

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
