from typing import Any, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API settings
    PROJECT_NAME: str = "Delilah Agentic"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Security settings
    SECRET_KEY: str = "your-secret-key"  # Change in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database settings
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "delilah"
    DB_ECHO: bool = False  # SQL query logging
    
    @property
    def POSTGRES_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()