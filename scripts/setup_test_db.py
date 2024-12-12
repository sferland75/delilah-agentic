#!/usr/bin/env python3
import asyncio
import asyncpg
from config import settings

async def setup_test_database():
    # Connect to default postgres database
    conn = await asyncpg.connect(
        user='postgres',
        password='postgres',
        database='postgres',
        host='localhost'
    )
    
    # Create test database if it doesn't exist
    try:
        await conn.execute(
            'CREATE DATABASE delilah_test'
        )
        print("Created test database 'delilah_test'")
    except asyncpg.exceptions.DuplicateDatabaseError:
        print("Test database 'delilah_test' already exists")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(setup_test_db())