from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Delilah Agentic"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "78f815264943c8e53bbd072a3c2e7db9ed7b22aa6dfe9ed467ff2044e7b07d8a"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/delilah"

    class Config:
        env_file = ".env"

settings = Settings()