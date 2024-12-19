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

The project has completed its initial database schema setup with the following components:

### Database Schema
- Clients (demographics, medical history)
- Therapists (credentials, specialties)
- Assessments (scheduling, status tracking)
- Documentation (clinical notes, progress tracking)
- Reports (assessment outcomes, recommendations)
- Agents (system process management)

All tables include UUID primary keys, timestamps for created_at/updated_at, and proper foreign key relationships.

## Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
venv\\Scripts\\activate  # Windows
source venv/bin/activate  # Unix
```

2. Install dependencies:
```bash
pip install fastapi sqlalchemy asyncpg pydantic-settings uvicorn pytest pytest-asyncio httpx
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
POSTGRES_USER=Delilah
POSTGRES_PASSWORD=delilah123
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=delilah
CORS_ORIGINS=["http://localhost:3000"]
DEBUG=true
```

5. Initialize the database:
```bash
alembic upgrade head
```

## Database Models

### Client
- Basic demographics
- Contact information
- Medical history
- Related assessments and documentation

### Therapist
- Professional credentials
- Specialties
- Active status tracking

### Assessment
- Client and therapist references
- Assessment type and status
- Scheduling information
- Completion tracking

### Documentation
- Clinical note types
- Content and metadata
- Links to clients, therapists, and assessments

### Report
- Assessment outcomes
- Summary content
- Recommendations

### Agent
- Process management
- State tracking
- Activity monitoring

## Next Steps

1. Data Population
   - Create test data generators
   - Design sample scenarios
   - Validate relationships and constraints

2. API Development
   - Implement CRUD operations for each model
   - Add validation and error handling
   - Design API endpoints for common workflows

3. Assessment System
   - Build assessment template system
   - Implement workflow logic
   - Add progress tracking

4. Documentation Features
   - Create documentation templates
   - Add auto-documentation features
   - Implement versioning system

5. Report Generation
   - Design report templates
   - Add customization options
   - Implement export features

## API Documentation

When the server is running, visit:
- http://localhost:8000/docs - Swagger UI
- http://localhost:8000/redoc - ReDoc UI

## Project Progress

See [Project Roadmap](ROADMAP.md) for detailed progress tracking.

## Development Notes

To pick up development in a new conversation with an AI assistant, use this prompt:

"I'm working on the Delilah Agentic project (https://github.com/sferland75/delilah-agentic), an occupational therapy field assessment system. We've completed the database schema and migrations, including models for clients, therapists, assessments, documentation, and reports. The next phase involves creating test data generators and implementing basic CRUD operations. Could you help me continue the development?"

This will provide the AI with proper context about the project's current state and immediate goals.
