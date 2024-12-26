# Development Guide for Delilah Agentic

## Development Environment Setup

### Prerequisites
1. Install the following tools:
   - Node.js 18+
   - Python 3.9+
   - Docker and Docker Compose
   - Git
   - Visual Studio Code (recommended) or your preferred IDE

### Initial Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd delilah-agentic
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Install frontend dependencies locally (optional, for IDE support):
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. Install backend dependencies locally (optional, for IDE support):
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

### Running the Application

#### Using Docker (Recommended)
1. Start all services:
   ```bash
   docker compose up --build
   ```

2. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

#### Running Services Individually (for Development)

##### Frontend
```bash
cd frontend
npm install
npm start
```

##### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Development Workflow

#### Frontend Development
1. The frontend uses TypeScript for better type safety
2. Component structure:
   ```
   frontend/src/
   ├── components/          # React components
   │   ├── Dashboard.tsx    # Main dashboard
   │   └── DetailedDashboard.tsx  # Detailed view
   ├── types/              # TypeScript definitions
   │   └── assessment.ts   # Data types
   ├── api/                # API client
   │   └── api.ts         # API functions
   └── config/             # Configuration
       └── index.ts       # Environment config
   ```

3. Adding new components:
   - Create component in `src/components/`
   - Add types if needed in `src/types/`
   - Update routing in `App.tsx`

4. Available scripts:
   ```bash
   npm start    # Start development server
   npm test     # Run tests
   npm build    # Create production build
   ```

#### Backend Development
1. The backend uses FastAPI with Python
2. Structure:
   ```
   backend/
   ├── main.py            # Main application file
   ├── requirements.txt   # Python dependencies
   └── Dockerfile        # Docker configuration
   ```

3. Adding new endpoints:
   - Add routes in `main.py`
   - Use Pydantic models for request/response validation
   - Add CORS origins if needed

4. Running backend services:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Type Safety

#### Frontend
1. Use TypeScript interfaces for all data structures
2. Define types in `src/types/`
3. Use strict type checking:
   ```typescript
   // Example type usage
   interface Assessment {
     id: string;
     status: 'draft' | 'in_progress' | 'completed' | 'reviewed';
     assessment_type: string;
     patient_info: PatientInfo;
   }
   ```

#### Backend
1. Use Pydantic models for data validation
2. Define clear request/response models:
   ```python
   class Assessment(BaseModel):
       id: str
       status: Literal['draft', 'in_progress', 'completed', 'reviewed']
       assessment_type: str
       patient_info: PatientInfo
   ```

### Testing

#### Frontend Testing
```bash
cd frontend
npm test
```

#### Backend Testing
```bash
cd backend
pytest
```

### Common Development Tasks

1. Adding a new assessment type:
   - Add type to `Assessment` interface in `types/assessment.ts`
   - Update backend validation in `main.py`
   - Add UI components as needed

2. Modifying the dashboard:
   - Update `components/Dashboard.tsx`
   - Add new components in `components/`
   - Update types if needed

3. Adding API endpoints:
   - Add endpoint in `main.py`
   - Add corresponding API function in `api/api.ts`
   - Update types if needed

### Debugging

#### Frontend Debugging
1. Using Chrome DevTools:
   - Open Chrome DevTools (F12)
   - Check Console for errors
   - Use Network tab to verify API calls
   - Use React DevTools for component debugging

2. Using VS Code:
   - Use debugger for Chrome extension
   - Add breakpoints in code
   - Use console.log for debugging

#### Backend Debugging
1. Using VS Code:
   - Use Python debugger
   - Add breakpoints in code
   - Check FastAPI logs

2. Using FastAPI debug tools:
   - Access /docs for API documentation
   - Use logger.debug() for logging

### Code Style

#### Frontend
- Use functional components
- Follow React Hooks patterns
- Use TypeScript strict mode
- Follow ESLint rules

#### Backend
- Follow PEP 8 guidelines
- Use type hints
- Use async/await patterns
- Document functions with docstrings

### Git Workflow
1. Create feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push changes:
   ```bash
   git push origin feature/your-feature-name
   ```

### Troubleshooting Common Issues

1. Docker Issues:
   ```bash
   # Reset Docker state
   docker compose down -v
   docker system prune -f
   docker compose up --build
   ```

2. Frontend Issues:
   ```bash
   # Clear npm cache
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

3. Backend Issues:
   ```bash
   # Reset Python environment
   rm -rf venv
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. CORS Issues:
   - Check backend CORS configuration
   - Verify frontend API URL
   - Check browser console for CORS errors