# Delilah Agentic

A FastAPI-based occupational therapy field assessment system with support for client management, assessments, documentation, and reporting.

## Project Overview

Delilah Agentic is designed to streamline occupational therapy assessments and documentation. The system features:

- Client and therapist management
- Assessment scheduling and tracking
- Clinical documentation
- Report generation
- Multi-agent architecture for distributed processing

## Current Status

The project has completed:
1. Initial database schema setup
2. Test data generation scripts
3. CRUD API implementations for all models:
   - Clients
   - Therapists
   - Assessments
   - Documentation
   - Reports

### Next Steps
1. Testing API endpoints
2. Implementing authentication
3. Adding more complex queries and filters
4. Building the frontend interface

## Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
venv\\Scripts\\activate  # Windows
source venv/bin/activate  # Unix
```

2. Install dependencies:
```bash
pip install fastapi sqlalchemy asyncpg pydantic-settings uvicorn pytest pytest-asyncio httpx faker
```

3. Set up PostgreSQL:
```sql
-- Connect as postgres user
psql -U postgres

-- Create user and database
CREATE USER "Delilah" WITH PASSWORD 'delilah123';
CREATE DATABASE delilah;
GRANT ALL PRIVILEGES ON DATABASE delilah TO "Delilah";
ALTER USER "Delilah" WITH SUPERUSER;
```

4. Create `.env` file:
```env
SECRET_KEY=78f815264943c8e53bbd072a3c2e7db9ed7b22aa6dfe9ed467ff2044e7b07d8a
DEBUG=true
DATABASE_URL=postgresql+asyncpg://Delilah:delilah123@localhost:5432/delilah
CORS_ORIGINS=["http://localhost:3000"]

POSTGRES_USER=Delilah
POSTGRES_PASSWORD=delilah123
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=delilah
```

5. Populate test data:
```bash
python scripts/populate_db.py
```

## API Documentation

When the server is running, visit:
- http://localhost:8000/docs - Swagger UI
- http://localhost:8000/redoc - ReDoc UI

## Development Notes

To pick up development in a new conversation with an AI assistant, use this prompt:

"I'm working on the Delilah Agentic project (https://github.com/sferland75/delilah-agentic), an occupational therapy field assessment system. We've completed the database schema, test data generation, and CRUD operations for all models (clients, therapists, assessments, documentation, and reports). The next phase involves testing these API endpoints. Could you help me set up and run tests for these endpoints?"

This will provide the AI with proper context about the project's current state and immediate goals.