import asyncio
import asyncpg
from dotenv import load_dotenv
import os
import subprocess
import sys
import json
import csv
from pathlib import Path

# Load environment variables
load_dotenv()

# Set the project root directory and npm path
PROJECT_ROOT = Path('D:/delilah-agentic').resolve()
FRONTEND_DIR = PROJECT_ROOT / 'frontend'
NPM_PATH = Path('C:/Program Files/nodejs/npm.cmd')  # Use npm.cmd on Windows

async def ensure_database_exists():
    """Ensure the database exists, create it if it doesn't"""
    sys.stdout.write("Checking database... ")
    try:
        conn = await asyncpg.connect(
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_SERVER'),
            port=os.getenv('POSTGRES_PORT'),
            database='postgres'
        )
        
        result = await conn.fetch(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            os.getenv('POSTGRES_DB')
        )
        
        if not result:
            await conn.execute(f"CREATE DATABASE {os.getenv('POSTGRES_DB')}")
            print("Created database")
        else:
            print("Database exists")
            
        await conn.close()
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

async def run_migrations():
    """Run alembic migrations"""
    sys.stdout.write("Running migrations... ")
    try:
        subprocess.run(["alembic", "upgrade", "head"], check=True, cwd=str(PROJECT_ROOT))
        print("Done")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {str(e)}")
        return False

async def import_mock_data():
    """Import mock data from CSV files"""
    sys.stdout.write("Importing mock data... ")
    try:
        conn = await asyncpg.connect(
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_SERVER'),
            port=os.getenv('POSTGRES_PORT'),
            database=os.getenv('POSTGRES_DB')
        )

        # Import clients
        with open(PROJECT_ROOT / 'clients_backup.csv', 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                await conn.execute("""
                    INSERT INTO clients (id, first_name, last_name, email, phone, date_of_birth, 
                                      emergency_contact, primary_diagnosis, notes, is_active)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    ON CONFLICT (id) DO NOTHING
                """, row['id'], row['first_name'], row['last_name'], row['email'], 
                row['phone'], row['date_of_birth'], row['emergency_contact'],
                row['primary_diagnosis'], row['notes'], row['is_active'])

        # Import therapists
        with open(PROJECT_ROOT / 'therapists_backup.csv', 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                await conn.execute("""
                    INSERT INTO therapists (id, first_name, last_name, email, phone, 
                                         license_number, license_state, years_of_experience,
                                         assessment_count, rating, is_active)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                    ON CONFLICT (id) DO NOTHING
                """, row['id'], row['first_name'], row['last_name'], row['email'],
                row['phone'], row['license_number'], row['license_state'],
                row['years_of_experience'], row['assessment_count'], row['rating'],
                row['is_active'])

        # Import assessments
        with open(PROJECT_ROOT / 'assessments_backup.csv', 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                await conn.execute("""
                    INSERT INTO assessments (id, client_id, therapist_id, assessment_type,
                                          status, scheduled_date, completion_date, notes)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (id) DO NOTHING
                """, row['id'], row['client_id'], row['therapist_id'],
                row['assessment_type'], row['status'], row['scheduled_date'],
                row['completion_date'], row['notes'])

        await conn.close()
        print("Done")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def setup_frontend():
    """Setup frontend dependencies"""
    print("Setting up frontend...")
    try:
        os.chdir(str(FRONTEND_DIR))
        print(f"Changed to directory: {os.getcwd()}")
        
        # Run npm install with full path
        result = subprocess.run([str(NPM_PATH), "install"], 
                              capture_output=True, 
                              text=True)
        
        if result.returncode != 0:
            print(f"npm install failed: {result.stderr}")
            return False
            
        print("Frontend setup complete")
        return True
    except Exception as e:
        print(f"Frontend setup error: {str(e)}")
        return False
    finally:
        os.chdir(str(PROJECT_ROOT))

async def start_backend():
    """Start the backend server"""
    try:
        subprocess.Popen(["uvicorn", "main:app", "--reload"], cwd=str(PROJECT_ROOT))
        print("Backend server started")
        return True
    except Exception as e:
        print(f"Error starting backend: {str(e)}")
        return False

def start_frontend():
    """Start the frontend development server"""
    try:
        os.chdir(str(FRONTEND_DIR))
        subprocess.Popen([str(NPM_PATH), "run", "dev"])
        os.chdir(str(PROJECT_ROOT))
        print("Frontend server started")
        return True
    except Exception as e:
        print(f"Error starting frontend: {str(e)}")
        return False

async def main():
    """Main startup sequence"""
    os.chdir(str(PROJECT_ROOT))
    print(f"Working directory: {os.getcwd()}")
    
    if not await ensure_database_exists():
        return
    
    if not await run_migrations():
        return
    
    if not await import_mock_data():
        return
    
    if not setup_frontend():
        return
    
    if not await start_backend():
        return
    
    if not start_frontend():
        return
    
    print("\nStartup complete! Services running:")
    print("- Backend: http://localhost:8000")
    print("- Frontend: http://localhost:5173")
    print("\nPress Ctrl+C to stop all services")

if __name__ == "__main__":
    try:
        asyncio.run(main())
        while True:
            print("Services are running...")
            asyncio.run(asyncio.sleep(5))
    except KeyboardInterrupt:
        print("\nShutting down...")