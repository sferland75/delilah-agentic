import asyncio
import asyncpg
from dotenv import load_dotenv
import os

async def create_mydb():
    try:
        # Connect to default postgres database
        conn = await asyncpg.connect(
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_SERVER'),
            port=os.getenv('POSTGRES_PORT'),
            database='postgres'
        )
        
        # Create mydb if it doesn't exist
        await conn.execute('CREATE DATABASE mydb')
        print("Created mydb database")
        
        await conn.close()
    except asyncpg.exceptions.DuplicateDatabaseError:
        print("mydb database already exists")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    load_dotenv()
    asyncio.run(create_mydb())