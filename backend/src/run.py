import asyncio
from database.database import engine
from database.models import Base
import uvicorn
import logging

async def init_db():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise

async def main():
    print("Initializing database...")
    await init_db()

if __name__ == "__main__":
    try:
        asyncio.run(main())
        print("Starting FastAPI server...")
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True
        )
    except KeyboardInterrupt:
        print("Shutting down...")