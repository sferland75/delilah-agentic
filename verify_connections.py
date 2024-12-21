import asyncio
import asyncpg
from dotenv import load_dotenv
import os

async def check_connection(db_name):
    try:
        conn = await asyncpg.connect(
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_SERVER'),
            port=os.getenv('POSTGRES_PORT'),
            database=db_name
        )
        
        result = await conn.fetchval('SELECT 1')
        print(f"Successfully connected to {db_name}")
        
        await conn.close()
        return True
    except Exception as e:
        print(f"Error connecting to {db_name}: {str(e)}")
        return False

async def main():
    # Check both databases
    await check_connection('mydb')
    await check_connection(os.getenv('POSTGRES_DB'))
    
    # Check if tables exist in the main database
    try:
        conn = await asyncpg.connect(
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_SERVER'),
            port=os.getenv('POSTGRES_PORT'),
            database=os.getenv('POSTGRES_DB')
        )
        
        tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        
        print("\nExisting tables:")
        for table in tables:
            print(f"- {table['table_name']}")
        
        await conn.close()
    except Exception as e:
        print(f"Error checking tables: {str(e)}")

if __name__ == "__main__":
    load_dotenv()
    asyncio.run(main())