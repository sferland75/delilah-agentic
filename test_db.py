import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def test_connection():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('POSTGRES_DB'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_SERVER'),
            port=os.getenv('POSTGRES_PORT')
        )
        print("Successfully connected to PostgreSQL!")
        conn.close()
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {e}")

if __name__ == "__main__":
    test_connection()