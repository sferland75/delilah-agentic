from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://sferl:postgres@localhost:5432/delilah"
    
    # Security
    SECRET_KEY: str = "dev_secret_key_123"
    
    # Application
    DEBUG: bool = True
    APP_NAME: str = "Delilah Agentic"
    API_V1_STR: str = "/api/v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
