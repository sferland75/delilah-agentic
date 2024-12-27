# Delilah Agentic

A modern clinical management system with AI-assisted analysis capabilities.

## Documentation Structure

### Core Documentation
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - System architecture and data models
- [`docs/API.md`](docs/API.md) - API endpoints and usage
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) - Development setup and guidelines
- [`docs/SECURITY.md`](docs/SECURITY.md) - Security practices and configurations

### Project Management
- [`DEVELOPMENT_STATUS.md`](DEVELOPMENT_STATUS.md) - Current development status and roadmap
- [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) - Project progress and milestones
- [`CHANGELOG.md`](CHANGELOG.md) - Version history and changes

### Development Guides
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) - Contribution guidelines
- [`docs/architecture/`](docs/architecture/) - Architecture Decision Records (ADRs)

### Component Documentation
- [`agents/README.md`](agents/README.md) - AI Agent system documentation
- [`backend/README.md`](backend/README.md) - Backend service documentation
- [`frontend/README.md`](frontend/README.md) - Frontend application documentation

## System Overview

Delilah Agentic is a comprehensive clinical management system that includes:
- Patient Management
- Assessment Tracking
- Report Generation
- AI-Assisted Analysis
- Clinical Documentation

### Key Features
- Modern React + TypeScript frontend
- FastAPI backend with async support
- PostgreSQL database with async SQLAlchemy
- AI agent integration
- JWT authentication
- Role-based access control

## Architecture

```
delilah-agentic/
├── backend/
│   ├── api/          - API endpoints
│   ├── models/       - Database models
│   ├── schemas/      - Pydantic schemas
│   └── services/     - Business logic
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   └── pages/
│   └── public/
└── docs/            - Documentation
```