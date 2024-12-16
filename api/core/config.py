from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Basic configuration
    API_VERSION: str = "v1"
    DEBUG: bool = False
    SECRET_KEY: str
    
    # Database
    DATABASE_URL: str
    
    # CORS
    CORS_ORIGINS: List[str]

    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }

settings = Settings()

# Debug print to verify settings
print("Settings loaded:", {
    "DEBUG": settings.DEBUG,
    "API_VERSION": settings.API_VERSION,
    "DATABASE_URL": settings.DATABASE_URL,
    "CORS_ORIGINS": settings.CORS_ORIGINS
})