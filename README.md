# Delilah Agentic

A FastAPI-based occupational therapy field assessment system.

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

## Project Progress

### Core Infrastructure (85% Complete)
- [x] FastAPI REST API setup (100%)
- [x] PostgreSQL database integration (100%)
- [x] Basic CRUD operations (100%)
- [x] Authentication system setup (80%)
- [x] Environment configuration (100%)
- [x] Project structure (90%)
- [-] Database migrations (30%)
- [-] Error handling system (50%)

### Agent System (60% Complete)
- [x] AgentCoordinator base implementation (90%)
- [x] Inter-agent message queuing (80%)
- [x] Session management (70%)
- [-] Agent state persistence (40%)
- [-] Error recovery mechanisms (20%)
- [-] Agent monitoring system (0%)

### Assessment Module (45% Complete)
- [x] Basic assessment flow (80%)
- [x] Assessment types structure (60%)
- [-] Assessment templates (40%)
- [-] Dynamic question generation (30%)
- [-] Progress tracking (20%)
- [-] Assessment validation (10%)
- [ ] Assessment versioning (0%)
- [ ] Branching logic (0%)

### Documentation System (40% Complete)
- [x] Basic documentation structure (70%)
- [-] Documentation templates (40%)
- [-] Auto-documentation features (30%)
- [ ] Documentation versioning (0%)
- [ ] Audit trail system (0%)
- [ ] Document export features (0%)

### Analysis Engine (30% Complete)
- [-] Basic data analysis (50%)
- [-] Trend detection (20%)
- [-] Pattern recognition (20%)
- [ ] Comparative analysis (0%)
- [ ] Statistical reporting (0%)
- [ ] Data visualization (0%)

### Report Generation (25% Complete)
- [-] Basic report templates (40%)
- [-] Report customization (30%)
- [ ] Multi-format export (0%)
- [ ] Report versioning (0%)
- [ ] Template management (0%)

### Client/Therapist Management (55% Complete)
- [x] Basic client profiles (90%)
- [x] Therapist profiles (80%)
- [-] Client history tracking (40%)
- [-] Therapist assignment system (30%)
- [ ] Schedule management (0%)
- [ ] Client portal (0%)

### Frontend Development (15% Complete)
- [-] Basic UI components (30%)
- [-] Authentication views (20%)
- [-] Assessment interface (10%)
- [ ] Report viewing interface (0%)
- [ ] Analytics dashboard (0%)
- [ ] Admin panel (0%)

## Development Roadmap

### 1. Critical Path (Next 2-3 Weeks)
1. Complete database migrations system
2. Finish authentication system
3. Implement core assessment templates
4. Complete basic documentation features
5. Enhance error handling system

### 2. Core Features (Following 4-6 Weeks)
1. Build out assessment validation
2. Implement assessment branching logic
3. Complete documentation templates
4. Develop basic analysis engine features
5. Create essential report templates
6. Build fundamental frontend views

### 3. Enhanced Features (6-8 Weeks)
1. Implement advanced assessment features
2. Build audit trail system
3. Develop pattern recognition
4. Create data visualization components
5. Build client/therapist portals
6. Implement schedule management

### 4. Advanced Features (8-12 Weeks)
1. Implement advanced analysis capabilities
2. Build comprehensive reporting system
3. Create analytics dashboard
4. Develop advanced UI components
5. Build template management system
6. Implement system-wide versioning

### 5. Final Phase (4-6 Weeks)
1. System optimization
2. Security hardening
3. Performance testing
4. User acceptance testing
5. Documentation completion
6. Production deployment preparation

Legend:
- [x] Complete (80-100%)
- [-] In Progress (20-70%)
- [ ] Not Started (0-10%)
