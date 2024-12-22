# Contributing to Delilah Agentic

## Development Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual feature development
- `release/*`: Release preparation
- `hotfix/*`: Production fixes

### Feature Development Process
1. Create feature branch from `develop`
2. Make regular commits with semantic commit messages
3. Complete pre-push checklist
4. Create pull request

For detailed guidelines, see the full [Development Guidelines](DEVELOPMENT.md).

## Code Review Process

### Review Checklist
- Code quality and style
- Test coverage
- Documentation updates
- Performance implications
- Security considerations

### Review Comments
- Be specific and constructive
- Reference best practices
- Suggest improvements
- Acknowledge good solutions

## Testing Requirements

### Required Tests
- Unit tests for core functionality
- Integration tests for component interactions
- Performance tests for critical paths
- API endpoint tests

## Documentation Standards

### Code Documentation
- Use TSDoc for TypeScript files
- Include docstrings in Python files
- Document complex logic with examples

### API Documentation
- Keep docs/API.md updated
- Include request/response examples
- Document error states

For more information, see [API Documentation](API.md).