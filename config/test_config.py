# config/test_config.py
class TestSettings:
    TEST_POSTGRES_USER: str = "test"
    TEST_POSTGRES_PASSWORD: str = "test"
    TEST_POSTGRES_HOST: str = "localhost"
    TEST_POSTGRES_PORT: str = "5432"
    TEST_POSTGRES_DB: str = "delilah_test"
    
    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+asyncpg://{self.TEST_POSTGRES_USER}:"
            f"{self.TEST_POSTGRES_PASSWORD}@{self.TEST_POSTGRES_HOST}:"
            f"{self.TEST_POSTGRES_PORT}/{self.TEST_POSTGRES_DB}"
        )

test_settings = TestSettings()