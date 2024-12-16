# Delilah Agentic

A FastAPI-based agent management system.

## Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Unix
```

2. Install dependencies:
```bash
pip install fastapi sqlalchemy psycopg2-binary pydantic-settings uvicorn pytest pytest-asyncio httpx
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
DATABASE_URL=postgresql://Delilah:delilah123@localhost:5432/delilah
CORS_ORIGINS=["http://localhost:3000"]
DEBUG=true
```

5. Run the server:
```bash
python run.py
```

## Testing

Run the tests with:
```bash
pytest tests/test_agent.py -v
```

## API Documentation

When the server is running, visit:
- http://localhost:8000/docs - Swagger UI
- http://localhost:8000/redoc - ReDoc UI

## Features

- Agent CRUD operations
- PostgreSQL database backend
- FastAPI REST API
- Automated testing
- Type validation with Pydantic
- Database migrations (coming soon)
