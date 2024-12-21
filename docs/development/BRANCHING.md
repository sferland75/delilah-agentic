# Branch Strategy

## Current Branches

### main
- Production-ready code
- Protected branch
- Requires PR review
- Must pass all tests

### feature/agent-system-dev
- Active development branch
- Contains agent system implementation
- Database integration
- Testing infrastructure

## Workflow
1. All new features branch from `feature/agent-system-dev`
2. Feature branches follow naming: `feature/[feature-name]`
3. Bug fixes follow naming: `fix/[bug-description]`
4. PRs merge back to `feature/agent-system-dev`
5. When stable, `feature/agent-system-dev` will merge to `main`

## Commit Standards
- feat: New features
- fix: Bug fixes
- docs: Documentation changes
- test: Test additions or modifications
- refactor: Code refactoring
- chore: Maintenance tasks

## Protection Rules
- No direct pushes to main
- PR reviews required
- CI/CD must pass
- Linear history preferred