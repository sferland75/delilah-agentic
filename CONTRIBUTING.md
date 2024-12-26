# Contributing to Delilah Agentic

## Development Process

1. Select an issue to work on or create a new one
2. Create a feature branch from `develop`
3. Implement changes following our guidelines
4. Submit a pull request

## Environment Setup

### Frontend Development

```bash
cd frontend
npm install
npm start
```

Key technologies:
- React 18
- TypeScript 4.9
- TailwindCSS
- React Router 6

### Backend Development

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Key technologies:
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL

### Database Migrations

```bash
# Create new migration
alembic revision -m "description"

# Run migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Code Style

### Python
- Use Black formatter
- 88 characters line length
- Type hints required
- Docstrings for public functions

### TypeScript
- Use ESLint configuration
- Explicit types required
- Functional components preferred
- Props interfaces required

### Testing
- Python: pytest
- Frontend: React Testing Library
- Coverage minimum: 80%

## Pull Request Process

1. Update documentation
2. Add/update tests
3. Ensure all tests pass
4. Update DEVELOPMENT_STATUS.md
5. Request review

## Additional Guidelines

### Git Commits
```
feat: Add user authentication
^--^  ^--------------------^
|     |
|     +-> Summary in present tense
|
+-------> Type: feat, fix, docs, style, refactor, test, chore
```

### Documentation
- Update README.md for new features
- Keep DEVELOPMENT_STATUS.md current
- Document all API endpoints
- Add JSDoc comments for components

### Security
- No secrets in code
- Input validation required
- SQL injection prevention
- XSS protection

## Questions?

Open an issue labeled 'question' if you need clarification on any of these guidelines.