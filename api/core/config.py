from pydantic_settings import BaseSettings
from typing import List
import os

# Clear problematic environment variables if they exist
if 'DEBUG' in os.environ and os.environ['DEBUG'] == '*':
    del os.environ['DEBUG']

class Settings(BaseSettings):
    # Basic configuration
    API_VERSION: str = "v1"
    DEBUG: bool = False  # default value if not set
    SECRET_KEY: str
    
    # Database
    DATABASE_URL: str
    
    # CORS
    CORS_ORIGINS: List[str]

    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "ignore"
    }

settings = Settings()

# Debug print to verify settings
print("Settings loaded:", {
    "DEBUG": settings.DEBUG,
    "API_VERSION": settings.API_VERSION,
    "DATABASE_URL": settings.DATABASE_URL,
    "CORS_ORIGINS": settings.CORS_ORIGINS
})