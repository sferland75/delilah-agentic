#!/usr/bin/env python3
import asyncio
import asyncpg
import sys
import os

# Add project root to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config import settings

async def setup_test_database():
    # Connect to default postgres database
    try:
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
    except Exception as e:
        print(f"Error: {str(e)}")
        print("\nMake sure PostgreSQL is running and accessible with these credentials:")
        print("  Host: localhost")
        print("  User: postgres")
        print("  Password: postgres")
        print("  Database: postgres")

if __name__ == "__main__":
    asyncio.run(setup_test_database())