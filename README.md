# Delilah Agentic

Modular Agentic Application for Occupational Therapy Field Assessments

## Quick Start

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up the database:
```bash
# Create a PostgreSQL database
# Copy .env.example to .env and update database credentials

# Run migrations
alembic upgrade head
```

3. Run the web interface:
```bash
# Start the backend API
uvicorn api:app --reload

# The frontend React component can be integrated into your React application
```

4. Or run the CLI demo:
```bash
python cli.py
```

## Components

- Assessment Agent: Guides through assessment protocols
- Documentation Agent: Handles data capture and storage
- Analysis Agent: Processes assessment data
- Report Agent: Generates assessment reports
- Coordinator: Manages inter-agent communication
- Web Interface: React-based user interface

## Project Structure

- `/agents`: Core agent implementations
  - `base.py`: Base agent class with validation
  - `analysis_agent.py`: Analysis processing
  - `assessment_agent.py`: Assessment workflows
  - `documentation_agent.py`: Data capture
  - `report_agent.py`: Report generation
  - `client_manager.py`: Client data management
  - `therapist_manager.py`: Therapist operations
  - `user_manager.py`: User management
  - `export_manager.py`: Data export handling
- `/api`: FastAPI backend
  - `/models`: Pydantic models for validation
  - `/routes`: API endpoints
  - `/core`: Core functionality
- `/database`: SQLAlchemy models and migrations
  - `models.py`: Database schema
  - `/migrations`: Alembic migrations
- `/frontend`: React frontend components
- `coordinator.py`: Agent coordination logic
- `cli.py`: Command-line interface

## Implementation Status

### Completed (100%)
- Database Setup
- Basic Project Structure
- Core Agent Types Definition

### In Progress
- Database Migrations (75%)
- Models Implementation (60%)
- Agent Validation (30%)

### Pending
- API Routes
- Frontend Components
- Authentication/Authorization
- Testing Suite

## Development Roadmap

1. Current Focus:
   - Complete Agent validation implementation
   - Finish remaining database migrations
   - Add validation tests

2. Next Steps:
   - Implement API routes for agent management
   - Add authentication middleware
   - Create frontend components

3. Future Enhancements:
   - Add real-time agent communication
   - Implement caching layer
   - Add analytics dashboard

## Contributing

1. Create a new branch for your feature
2. Follow the established patterns for:
   - Agent implementation
   - Model validation
   - Database migrations
3. Ensure all tests pass
4. Submit a pull request

## License

MIT License - See LICENSE file for details