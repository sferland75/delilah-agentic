# Delilah Agentic - Developer Quick Start

## Repository Information

### Git Repository
- URL: https://github.com/sferland75/delilah-agentic
- Main Branch: main
- Current Active Branch: main

### Local Development
- Default local path: D:\delilah-agentic
- Database: PostgreSQL 16 (local or containerized)
- Node.js version: 20.x
- Python version: 3.12

## Quick Setup

1. Clone the repository:
```bash
git clone https://github.com/sferland75/delilah-agentic.git
cd delilah-agentic
```

2. Database Setup (Choose one):

   A. Local PostgreSQL:
   ```sql
   CREATE USER delilah WITH PASSWORD 'delilah123';
   CREATE DATABASE delilah_db;
   GRANT ALL PRIVILEGES ON DATABASE delilah_db TO delilah;
   \c delilah_db
   GRANT ALL ON SCHEMA public TO delilah;
   ALTER USER delilah SET search_path TO public;
   ```

   B. Containerized (requires Docker):
   ```bash
   docker-compose up db -d
   ```

3. Backend Setup:
```bash
pip install -r requirements.txt
alembic upgrade head  # Run migrations
uvicorn backend.main:app --reload  # Start backend
```

4. Frontend Setup:
```bash
cd frontend
npm install
npm start
```

## Key Files

### Configuration
- `.env` - Environment variables
- `alembic.ini` - Database migration settings
- `docker-compose.yml` - Container configuration

### Frontend
- `frontend/src/App.tsx` - Main application
- `frontend/src/components/` - React components
- `frontend/src/types/` - TypeScript definitions

### Backend
- `backend/main.py` - FastAPI application
- `alembic/versions/` - Database migrations
- `backend/database/models.py` - Database models

## Current Development State

### Working Features
- Basic infrastructure setup
- Frontend TypeScript configuration
- Initial database schema
- Basic component structure

### In Progress
- Database migrations
- Authentication system
- AI agent implementation

## Common Tasks

### Running Migrations
```bash
# Create new migration
alembic revision -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Running Tests
```bash
# Backend tests
pytest

# Frontend tests
cd frontend && npm test
```

### Building for Production
```bash
# Frontend
cd frontend && npm run build

# Docker
docker-compose -f docker-compose.prod.yml up --build
```

## Known Issues

1. Docker Desktop Performance
   - Current workaround: Use local development environment
   - Alternative: Use WSL2 backend directly

2. Frontend Build Time
   - Using optimized Dockerfile with multi-stage build
   - Consider local development for faster iteration

## Getting Help

1. Documentation
   - `docs/` directory
   - Component READMEs
   - Inline code comments

2. Project Structure
   ```
   delilah-agentic/
   ├── alembic/         # Database migrations
   ├── api/             # API endpoints
   ├── backend/         # Core backend
   ├── agents/          # AI agents
   ├── coordinator/     # Agent coordination
   ├── frontend/        # React frontend
   └── docker/          # Docker configs
   ```

3. IDE Setup
   - VS Code recommended
   - Python and Node.js extensions
   - ESLint and Prettier for frontend

## Next Steps

1. Review DEVELOPMENT_STATUS.md for current state
2. Check issues on GitHub
3. Review open pull requests
4. Set up local development environment

## Contacts

- Repository Owner: Sebastien Ferland
- Project Documentation: In-repo /docs directory
- Additional Support: Create GitHub issue with label 'question'