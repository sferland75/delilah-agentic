from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings
from services.auth_service import AuthService
import logging

logger = logging.getLogger(__name__)

# Create SQLAlchemy Base
Base = declarative_base()

engine = create_async_engine(settings.DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    try:
        # Import models to register them
        from models.user import User  # noqa: F401
        
        async with engine.begin() as conn:
            logger.info("Creating database tables...")
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
            logger.info("Tables created successfully")
        
        # Create test user in a separate session
        async with async_session() as session:
            logger.info("Creating test user...")
            # Create a new AuthService instance to use its password hashing
            auth_service = AuthService(session)
            hashed_password = auth_service.get_password_hash("test123")
            
            test_user = User(
                email="test@example.com",
                hashed_password=hashed_password,  # This will create a fresh bcrypt hash
                first_name="Test",
                last_name="User"
            )
            session.add(test_user)
            await session.commit()
            logger.info("Test user created successfully")
            
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        raise

async def get_db() -> AsyncSession:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()