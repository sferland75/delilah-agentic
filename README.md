# Delilah Agentic

## Overview
Delilah Agentic is a web application for managing Occupational Therapy field assessments. It provides a dashboard for viewing and managing patient assessments.

## Features
- Assessment status dashboard
- Patient assessment details
- Status tracking
- Assessment type categorization

## Tech Stack
- Frontend: React + TypeScript
- Backend: FastAPI (Python)
- Database: PostgreSQL (ready to integrate)
- Docker for containerization

## Project Structure
```
delilah-agentic/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application file
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── types/         # TypeScript definitions
│   │   ├── api/           # API client
│   │   └── config/        # Configuration
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml      # Docker configuration
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- Python 3.9+ (for local development)

### Running the Application
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/delilah-agentic.git
   cd delilah-agentic
   ```

2. Start the application:
   ```bash
   docker compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Development Notes
- The application uses TypeScript for type safety
- API endpoints are documented using FastAPI's automatic documentation
- Docker setup includes hot-reloading for both frontend and backend

## Current State
- Working dashboard showing assessment status
- Patient information display
- Assessment filtering
- Real-time status updates

## Next Steps
1. Add user authentication
2. Implement database integration
3. Add assessment creation/editing
4. Enhance filtering and sorting options
5. Add user role management