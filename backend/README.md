# Delilah Agentic Backend

## Current Architecture

```
backend/
├── database/
│   ├── models.py      # SQLAlchemy models
│   ├── schemas.py     # Pydantic schemas
│   └── session.py     # Database connection
├── api/
│   ├── endpoints/     # API route handlers
│   └── deps.py       # Dependencies
└── core/
    ├── config.py     # Configuration
    └── security.py   # Authentication
```

## Database Schema

### Users
- id: Integer (Primary Key)
- email: String (Unique)
- hashed_password: String
- is_active: Boolean
- is_superuser: Boolean

### Assessments
- id: Integer (Primary Key)
- patient_name: String
- assessment_type: String
- status: Enum('draft', 'in_progress', 'completed', 'reviewed')
- scores: JSONB

### Tasks
- id: Integer (Primary Key)
- agent_id: Integer (Foreign Key)
- status: String
- description: Text
- result: JSONB

## API Endpoints

### Current
- GET /health - Health check
- GET /docs - API documentation

### Planned
- POST /auth/login
- GET /assessments
- POST /assessments
- GET /assessments/{id}
- PUT /assessments/{id}
- GET /tasks
- POST /tasks/start

## Development

### Running Tests
```bash
pytest
```

### Adding Migrations
```bash
alembic revision -m "description"
alembic upgrade head
```

### Environment Variables
```
DATABASE_URL=postgresql://user:pass@localhost/db
SECRET_KEY=your-secret-key
DEBUG=True
```

## TODO

- [ ] Complete authentication system
- [ ] Implement CRUD for assessments
- [ ] Add task queue system
- [ ] Set up agent communication