from pydantic_settings import BaseSettings
from typing import Union

class Settings(BaseSettings):
    DATABASE_URL: str
    DEBUG: Union[bool, str] = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

    @property
    def debug_mode(self) -> bool:
        return str(self.DEBUG).lower() == 'true'

settings = Settings()